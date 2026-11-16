"""Limit a CI archive to ordinary files and safe relative symlinks."""
import posixpath
import sys
import tarfile
from pathlib import Path

archive, destination = sys.argv[1:]
total = 0
if archive != "/dev/stdin":
    raise ValueError("expected archive on standard input")
with tarfile.open(fileobj=sys.stdin.buffer, mode="r|gz") as source:
    for item in source:
        path = posixpath.normpath(item.name)
        if path.startswith("/") or path == ".." or path.startswith("../"):
            raise ValueError("archive member escapes release")
        if any(segment == ".git" or segment == ".env" or segment.startswith(".env.") for segment in path.split("/")):
            raise ValueError("archive contains a Git or environment file")
        if not (item.isfile() or item.isdir() or item.issym()):
            raise ValueError("unsupported archive member")
        if item.issym():
            link = posixpath.normpath(posixpath.join(posixpath.dirname(path), item.linkname))
            if item.linkname.startswith("/") or link == ".." or link.startswith("../"):
                raise ValueError("unsafe archive symlink")
        total += item.size
        if total > 2_000_000_000:
            raise ValueError("uncompressed release is too large")
        source.extract(item, path=destination, filter="data")
for name in ("server.js", "RELEASE_SHA", ".next/BUILD_ID"):
    item = Path(destination) / name
    if not item.is_file() or item.is_symlink():
        raise ValueError("missing release file: " + name)
