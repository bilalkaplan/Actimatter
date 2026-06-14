import docx

docx_path = r'C:\Users\Lenovo\Desktop\1\YAZILIM MÜHENDİSLİĞİ\Conference-template-A4-Guncel-v2.docx'

try:
    doc = docx.Document(docx_path)
    
    for p in doc.paragraphs:
        # 1. Hizalama düzeltmesi
        if "Problemin Tanımı ve Sektörel" in p.text:
            p.alignment = None
            p.paragraph_format.left_indent = None
            p.paragraph_format.right_indent = None
            p.paragraph_format.first_line_indent = None
            
            original_text = p.text
            stripped_text = original_text.lstrip()
            if original_text != stripped_text:
                p.text = stripped_text
                p.alignment = None
            print("Fixed alignment for:", p.text)
            
        # 2. Veritabanı H2 güncellemesi
        if "PostgreSQL" in p.text and "ACID" in p.text:
            # Sadece PostgreSQL yazan yeri güncelliyoruz
            p.text = p.text.replace("PostgreSQL veritabanı kullanılmıştır.", "PostgreSQL veritabanı ve geliştirme/test süreçlerinin hızlı yürütülmesi amacıyla bellek içi (in-memory) çalışan H2 veritabanı entegre edilmiştir.")
            print("Updated DB info:", p.text)

    doc.save(docx_path)
    print("Document successfully updated.")

except Exception as e:
    print(f"Error: {e}")
