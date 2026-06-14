import docx
from docx.enum.text import WD_ALIGN_PARAGRAPH

docx_path = r'C:\Users\Lenovo\Desktop\1\YAZILIM MÜHENDİSLİĞİ\Conference-template-A4-Guncel-v2.docx'

try:
    doc = docx.Document(docx_path)
    
    for p in doc.paragraphs:
        if "Problemin Tanımı" in p.text:
            # Kesin olarak SOLA YASLA
            p.alignment = WD_ALIGN_PARAGRAPH.LEFT
            
            # Tüm girintileri sıfırla
            p.paragraph_format.left_indent = None
            p.paragraph_format.right_indent = None
            p.paragraph_format.first_line_indent = None
            
            # Eğer başta/sonda boşluk varsa temizle
            original_text = p.text
            stripped_text = original_text.strip()
            if original_text != stripped_text:
                p.text = stripped_text
                # Metin değişince format bazen uçar, tekrar set et:
                p.alignment = WD_ALIGN_PARAGRAPH.LEFT

            print("Force fixed alignment for:", p.text)

    doc.save(docx_path)
    print("Document successfully updated to v2.")

except Exception as e:
    print(f"Error: {e}")
