import urllib.request
import urllib.parse

mermaid_code = """
erDiagram
    USER {
        Long id PK
        String username
        String email
        String password
        String role
    }
    EVENT {
        Long id PK
        String title
        String description
        LocalDateTime eventDate
        Integer capacity
        String location
        Long coordinator_id FK
    }
    REGISTRATION {
        Long id PK
        String status
        LocalDateTime registrationDate
        Long event_id FK
        Long user_id FK
    }

    USER ||--o{ EVENT : "creates"
    USER ||--o{ REGISTRATION : "makes"
    EVENT ||--o{ REGISTRATION : "receives"
"""

encoded = urllib.parse.quote(mermaid_code.strip())
url = f"https://quickchart.io/mermaid?w=800&h=600&fmt=png&code={encoded}"

try:
    urllib.request.urlretrieve(url, 'er_diagram.png')
    print('Successfully downloaded ER diagram from quickchart.')
except Exception as e:
    print(f'Error downloading image: {e}')
