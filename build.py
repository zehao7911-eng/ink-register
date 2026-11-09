from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import re

root = Path(__file__).resolve().parent

def module(name, binding=None, prelude=""):
    source = (root / name).read_text("utf-8-sig")
    names = re.findall(r"^export (?:function|class|const) (\w+)", source, re.M)
    source = re.sub(r"^import .*;\n", "", source, flags=re.M)
    source = re.sub(r"^export ", "", source, flags=re.M)
    if binding:
        return f"const {binding}=(()=>{{\n{prelude}\n{source}\nreturn {{{','.join(names)}}};}})();\n"
    return source

code = module("core.mjs", "C") + module("art.mjs", "Art", "const {JOBS}=C;")
code += module("sdk.mjs", "SDK") + "const {Press}=Art,{bridge}=SDK;\n" + module("app.mjs")
html = (root / "index-source.html").read_text("utf-8")
html = html.replace('<link rel="stylesheet" href="style.css">', "<style>" + (root / "style.css").read_text("utf-8") + "</style>")
html = html.replace('<script type="module" src="app.mjs"></script>', "<script>(()=>{\n" + code + "\n})();</script>")
for name in ("index.html", "standalone.html"):
    (root / name).write_text(html, "utf-8", newline="\n")
files = sorted(p for p in root.rglob("*") if p.is_file())
with ZipFile(root.parent / "INK-REGISTER.zip", "w", ZIP_DEFLATED, compresslevel=9) as archive:
    for file in files:
        archive.write(file, file.relative_to(root).as_posix())
with ZipFile(root.parent / "INK-REGISTER.zip") as archive:
    assert archive.testzip() is None
    assert archive.read("index.html") == archive.read("standalone.html")
    assert all(archive.read(file.relative_to(root).as_posix()) == file.read_bytes() for file in files)
