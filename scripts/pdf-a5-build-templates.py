#!/usr/bin/env python3
"""Maquetación v2 Fantasía Épica. Reutiliza la firma visual FAEP suministrada por su autor.
No distribuye fuentes sueltas. Las plantillas SVG mantienen textos editables.
"""
from pathlib import Path
import sys,json,re,random,copy
from html import escape
import cairosvg
sys.path.insert(0,str(Path(__file__).resolve().parent))
import build_templates as prev
R=Path(__file__).resolve().parents[1]; OUT=R/'templates'; OUT.mkdir(exist_ok=True)
REFERENCE=(R/'assets/naufragiod20_faep.svg').read_text(encoding='utf8')
match=re.search(r'(data:image/png;base64,[^"\s]+)',REFERENCE)
assert match, 'El SVG original de Fantasía Épica no expone la imagen esperada'
LOGO=match.group(1)
I='#141414'; SECOND='#4e4a47'; SOFT='#d2d0cb'; WASH='#f6f5f1'; PAPER='#fefefc'; GRAY='#aaa9a5'

def label(x,y,s,sz=2.05,align='start',fam='serif',color=SECOND,weight='normal',ls=.15):
    ff='Liberation Serif' if fam=='serif' else 'Komikazoom'
    return f'<text x="{x}" y="{y}" font-size="{sz}" font-family="{ff}" font-weight="{weight}" text-anchor="{align}" fill="{color}" letter-spacing="{ls}">{escape(s)}</text>'
def ln(x1,y1,x2,y2,sw=.24,col=SOFT):return f'<path d="M{x1:g} {y1:g}L{x2:g} {y2:g}" fill="none" stroke="{col}" stroke-width="{sw}" stroke-linecap="round"/>'
def rect(x,y,w,h,stroke=SOFT,fill='none',stroke_w=.22,r=0):return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{stroke_w}"/>'
def corner(x,y,dx=1,dy=1):return f'<path d="M{x+dx*3} {y}L{x} {y}L{x} {y+dy*3}" stroke="{I}" stroke-width=".55" fill="none"/>'
def hexagon(cx,cy,r,fill='none',col=I,sw=.4):
    pts=' '.join(f'{cx+u*r:.2f},{cy+v*r:.2f}' for u,v in [(0,-1),(.866,-.5),(.866,.5),(0,1),(-.866,.5),(-.866,-.5)])
    return f'<polygon points="{pts}" fill="{fill}" stroke="{col}" stroke-width="{sw}" />'
def brand(x,y,w=57):return f'<image x="{x}" y="{y}" width="{w}" height="{w*357/997:.3f}" href="{LOGO}" preserveAspectRatio="xMidYMid meet"/>'

def ink_flecks():
    r=random.Random(2026); a=[]
    # Ornamento de tinta muy tenue, sin invadir zonas para datos.
    for sx,sy in [(16,38.7),(129,38.7),(18,72.6),(133,72.6),(19,96.3),(131,96.3),(26,121.9),(126,121.9),(19,198.5),(130,198.5)]:
        for _ in range(13):
            x=sx+r.uniform(-8,8);y=sy+r.uniform(-1.4,1.4)
            a.append(f'<circle cx="{x:.2f}" cy="{y:.2f}" r="{r.uniform(.05,.29):.2f}" fill="#8e8e8a" opacity="{r.uniform(.06,.22):.2f}"/>')
    return ''.join(a)

def section_title(y,s):
    a=[ln(8,y+1.1,140,y+1.1,.36,'#96938e'),label(74,y-.45,s,3.15,'middle',weight='bold',color=I,ls=.22)]
    # el fondo blanco enmascara la regla por detrás del título
    tw=min(84,max(32,len(s)*1.82+9));a[1:1]=[rect(74-tw/2,y-4.4,tw,5.6,stroke='none',fill=PAPER,stroke_w=0)]
    a += [hexagon(9.7,y+1.1,.75,PAPER,I,.24),hexagon(138.3,y+1.1,.75,PAPER,I,.24)]
    return ''.join(a)

def common():
    a=['<?xml version="1.0" encoding="UTF-8"?>','<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="148mm" height="210mm" viewBox="0 0 148 210">',rect(0,0,148,210,'none',PAPER,0)]
    a.extend([ln(7.6,6.5,140.4,6.5,.28,'#bdbbb7'),ln(7.6,199.8,140.4,199.8,.27,SECOND),ink_flecks()])
    return a

def fixed_body():
    a=[section_title(37.5,'ATRIBUTOS')]
    attrs=['FUERZA','AGILIDAD','RESISTENCIA','MENTE','INTUICIÓN','PRESENCIA']
    for i,n in enumerate(attrs):
        x=(8,53,98)[i%3];y=40.7+(i//3)*13.2
        a.extend([rect(x,y,42,12,SOFT,'none',.26,.45),ln(x+1,y+4.6,x+40,y+4.6,.14,SOFT),
          label(x+2,y+3.3,n,2.25,weight='bold',color=I,ls=.1),
          label(x+2.2,y+8.5,'VA',2.0,weight='bold',color=SECOND),label(x+17,y+8.5,'DA',2,weight='bold',color=SECOND),
          ln(x+10,y+9.9,x+15,y+9.9,.19,GRAY),ln(x+24,y+9.9,x+39,y+9.9,.19,GRAY),hexagon(x+36.6,y+2.45,1.45,PAPER,I,.31)])
    a.append(section_title(71,'RECURSOS'))
    for j,n in enumerate(['SALUD','ESFUERZO','MOVIMIENTO','POTENCIA']):
        x=8+j*33.25
        a.extend([rect(x,74.1,31.4,15.3,SOFT,'none',.26,.4),label(x+2,77.75,n,2.27,weight='bold',color=I),
                  ln(x+2.2,86.3,x+29,86.3,.23,GRAY),hexagon(x+28,75.6,.73,PAPER,I,.2)])
    a.append(section_title(94.3,'EQUIPO Y PROTECCIÓN'))
    for x,s in [(8,'ARMADURA EQUIPADA'),(76,'ESCUDO EQUIPADO')]:
        a.extend([label(x,99.0,s,2.13,weight='bold',color=I),ln(x,103.1,x+61,103.1,.24,GRAY)])
    for x,s in [(8,'BLINDAJE'),(76,'PROTECCIÓN NATURAL')]:
        a.extend([label(x,109.1,s,2.13,weight='bold',color=I),ln(x,113.1,x+61,113.1,.24,GRAY)])
    a.extend([section_title(120.8,'RASGOS Y PERTENENCIAS'),ln(74,125,74,198,.22,SOFT)])
    return a

def footer(kind):
    return [label(8,204.35,'NAUFRAGIO d20 · FANTASÍA ÉPICA',2.35,fam='serif',color=SECOND,weight='bold'),
            label(140,204.35,kind,1.85,align='end',fam='serif',color=SECOND)]

def principal():
    a=common()
    a.extend([rect(8,8.2,70,26.5,'#aaa6a1','none',.24),
              corner(8,8.2),corner(78,8.2,-1),corner(8,34.7,1,-1),corner(78,34.7,-1,-1),
              brand(82,11,58.2)])
    # Cabecera retro inspirada en el panel original de Affinity
    for ypos,s,lstart in [(12.5,'NOMBRE',29),(17.55,'ESPECIE',29),(22.6,'OCUPACIÓN',34),(32.55,'CONCEPTO',32)]:
        a.extend([label(10,ypos,s,2.45,weight='normal',color=I,ls=.26),ln(lstart,ypos+.3,75,ypos+.3,.23,GRAY)])
    a.extend([label(10,27.6,'NIVEL',2.45,color=I),ln(23,27.9,32,27.9,.24,GRAY),
              label(38,27.6,'SEXO',2.45,color=I),ln(50,27.9,75,27.9,.24,GRAY)])
    a.extend(fixed_body());a.extend(footer('FICHA PRINCIPAL'));a.append('</svg>')
    return '\n'.join(a)

def continuation():
    a=common()
    a.extend([label(9,14,'HOJA DE',3.1,weight='bold',color=I),label(9,20,'CONTINUACIÓN',4,weight='bold',color=I),brand(90,7.9,50),
              ln(8,26.2,140,26.2,.33,SECOND),label(8,30.95,'PERSONAJE',2.35,color=I),ln(29,31.3,121.5,31.3,.22,GRAY),
              label(126,30.95,'PÁG.',2.2,color=I),ln(126,31.3,140,31.3,.22,GRAY),
              section_title(35,'REGISTRO DE PERSONAJE')])
    a.extend(footer('HOJA DE CONTINUACIÓN'));a.append('</svg>')
    return '\n'.join(a)

for name,body in [('forja-nd20-fantasia-epica-a5-v2',principal()),('forja-nd20-continuacion-a5-v2',continuation())]:
    (OUT/(name+'.svg')).write_text(body,encoding='utf8')
    cairosvg.svg2pdf(bytestring=body.encode('utf8'),write_to=str(OUT/(name+'.pdf')))

mapdata=json.loads((OUT/'campos-ficha-a5.json').read_text(encoding='utf8'))
new_boxes={'nombre':[29,9.7,46,3.0], 'especie':[29,14.75,46,3.0], 'ocupacion':[34,19.8,41,3],
           'nivel':[23,24.85,9,3], 'sexo':[50,24.85,25,3], 'concepto':[32,29.75,43,3]}
for fld in mapdata['campos_fijos']:
    if fld['id'] in new_boxes:
        x,y,w,h=new_boxes[fld['id']];fld['mm_superior_izquierda']=dict(x=x,y=y,width=w,height=h)
        fld['pdf_inferior_izquierda']=dict(x=round(x*72/25.4,3),y=round((210-y-h)*72/25.4,3),width=round(w*72/25.4,3),height=round(h*72/25.4,3))
mapdata['version']='0.3.0-fantasia-epica-v2';mapdata['identidad']='naufragiod20_faep.svg; Source Serif Pro (histórica), Komikazoom; maquetación blanco y negro.'
mapdata['zonas_dinamicas'][-1]['mm_superior_izquierda']=dict(x=8,y=38,width=132,height=160)
for f in mapdata['campos_fijos']:f['fuente']='Source Serif Pro o compatible con cobertura Unicode (fuente de datos no distribuida)'
(OUT/'campos-ficha-a5-v2.json').write_text(json.dumps(mapdata,ensure_ascii=False,indent=2),encoding='utf8')
print('OK v2 Fantasia Epica dos SVG/PDF y',len(mapdata['campos_fijos']),'campos')
