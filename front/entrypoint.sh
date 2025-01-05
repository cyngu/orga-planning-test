#!/bin/sh
echo "Proceed to replace env variables"
set -e

# Replace placeholder env variables in all files in the build
printenv | grep NEXT_PUBLIC_ | while read -r line ; do
  key=$(echo $line | cut -d "=" -f1)
  value=$(echo $line | cut -d "=" -f2)
  echo "Replacing $key"
  find /usr/src/app/.next/ -type f -exec sed -i "s|$key|$value|g" {} \;
done

# Passe the control to the main process specified with CMD instruction
exec "$@"