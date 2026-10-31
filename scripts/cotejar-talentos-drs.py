#!/usr/bin/env python3
"""Cotejo reproducible de Talentos DRS. Solo stdlib; no modifica documentos."""
import argparse
import hashlib
import json
import sys
import zipfile
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def parrafos_docx(ruta):
    with zipfile.ZipFile(ruta) as archivo:
        documento = ET.fromstring(archivo.read("word/document.xml"))
    resultado = []
    for elemento in documento.findall("./w:body/w:p", NS):
        resultado.append("".join(n.text or "" for n in elemento.findall(".//w:t", NS)))
    return resultado


def verificar(fuente, catalogo, huellas):
    p = parrafos_docx(fuente)
    registros = catalogo["registros"]
    assert len(registros) == 24, "El catálogo deja de tener 24 relaciones DRS"
    assert len(huellas["huellas"]) == 24, "Faltan huellas independientes"
    assert len(set(x["id"] for x in registros)) == 24, "IDs duplicados"
    for r in registros:
        clave = r["propietario"] + "|" + r["nombre"]
        assert clave in huellas["huellas"], "Huella ausente: " + clave
        parrafo_efecto = r["parrafos_documento"][-1]
        literal = p[parrafo_efecto]
        assert literal == r["efecto_literal"], (
            f"Texto distinto: {clave} (párrafo {parrafo_efecto})"
        )
        calculada = hashlib.sha256(literal.encode("utf-8")).hexdigest()
        assert calculada == huellas["huellas"][clave], "Huella modificada: " + clave
        etiqueta = r["titulo"]
        if r["tipo_origen"] == "Especie":
            assert p[parrafo_efecto - 1] == etiqueta, (
                "Nombre de Talento no coincide: " + clave
            )
            assert r["activacion_literal"] is None
            assert r["atributo_literal"] is None
            assert r["coste_literal"] is None
        else:
            inicio = r["parrafos_documento"][0]
            assert p[inicio] == etiqueta, "Nombre de Ocupación: " + clave
            metadatos = p[inicio + 1:parrafo_efecto]
            for campo in ("activacion_literal", "atributo_literal", "coste_literal"):
                valor = r[campo]
                if valor is not None:
                    assert valor in metadatos, (
                        f"{clave}: {campo} no está entre el título y efecto"
                    )
    documento_sha = hashlib.sha256(fuente.read_bytes()).hexdigest()
    print("OK: 24/24 Talentos DRS; nombre, efecto, huella y campos literales.")
    print("Fuente:", fuente.name)
    print("SHA-256 DOCX:", documento_sha)
    if documento_sha != huellas["huella_documento_sha256"]:
        print("AVISO: DOCX distinto del auditado; las 24 fichas sí coinciden.", file=sys.stderr)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--fuente", type=Path, required=True,
                        help="Ruta local al NaufragioD20DRS.docx original")
    parser.add_argument("--catalogo", type=Path,
                        default=ROOT / "data/talentos-drs-literales.json")
    parser.add_argument("--huellas", type=Path,
                        default=ROOT / "docs/enciclopedia/109a-huellas-talentos-drs.json")
    args = parser.parse_args()
    verificar(args.fuente, json.loads(args.catalogo.read_text(encoding="utf-8")),
             json.loads(args.huellas.read_text(encoding="utf-8")))


if __name__ == "__main__":
    main()
