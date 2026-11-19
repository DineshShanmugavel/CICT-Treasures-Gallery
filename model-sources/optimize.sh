#!/bin/sh
# Web copies of the Five Landscapes models (as kurinji.web.glb, with a looser simplify error so
# these denser scans also come down to a few hundred thousand triangles).
SRC="../public/5 lanscapes food"
for pair in "Mullai:mullai" "Marutham 2:marutham" "Neithal:neithal" "Paalai:palai"; do
  in="${pair%%:*}"; out="${pair##*:}"
  cp "$SRC/$in" "model-sources/$out.glb"
  echo "== $in -> $out.web.glb"
  npx --yes @gltf-transform/cli optimize "model-sources/$out.glb" "$SRC/$out.web.glb" --compress meshopt --simplify-ratio 0.06 --simplify-error 0.05 --texture-compress webp --texture-size 2048 2>&1 | tail -3
  rm -f "model-sources/$out.glb"
done
ls -la "$SRC"/*.web.glb
