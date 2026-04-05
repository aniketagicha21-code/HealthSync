import io


def extract_text_from_pdf(file_bytes: bytes, max_pages: int = 40) -> str:
    import pdfplumber

    buf = io.BytesIO(file_bytes)
    parts: list[str] = []
    with pdfplumber.open(buf) as pdf:
        for i, page in enumerate(pdf.pages):
            if i >= max_pages:
                parts.append(f"\n[Truncated after {max_pages} pages]\n")
                break
            text = page.extract_text() or ""
            parts.append(text)
    return "\n\n".join(parts).strip()
