for x in /Volumes/Nithin/polar/polar/part*; do
  y=$(basename $x)
  echo "Processing: $y"
  python extract.py $x nsidc/$y nscdic-crawl.error
done
