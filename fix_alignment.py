import docx

docx_path = r'C:\Users\Lenovo\Desktop\1\YAZILIM MÜHENDİSLİĞİ\Conference-template-A4-Guncel-v2.docx'

try:
    doc = docx.Document(docx_path)
    
    for p in doc.paragraphs:
        if "Fonksiyonel Gereksinimler" in p.text:
            # Sola yasla
            p.alignment = None
            # Girintiyi (indentation) sıfırla
            p.paragraph_format.left_indent = None
            p.paragraph_format.right_indent = None
            p.paragraph_format.first_line_indent = None
            
            print("Fixed alignment and indentation for:", p.text)
            
    doc.save(docx_path)
    print("Document successfully updated.")

except Exception as e:
    print(f"Error: {e}")
