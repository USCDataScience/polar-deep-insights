#!/bin/sh
cmd="$@"

if [ "${cmd}" == "grunt serve" ]; then
    echo "Installing requirements..."

    if [ -f 'package.json' ]; then 
        npm install || exit
    else 
        echo "No 'package.json' inside $(pwd). Skipping 'npm install'."
    fi

    if [ -f 'bower.json' ]; then
        bower install || exit
    else 
        echo "No 'bower.json' inside $(pwd). Skipping 'bower install'."
    fi
fi

echo "Running the container command '${cmd}'..."
exec $cmd
