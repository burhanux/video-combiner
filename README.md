## Create a file named videos.txt and add the following:
```txt
video1.mp4
video2.mp4
...
```
## Run the program with file:
```bash
node main.js --file videos.txt
```

## Run the program via CLI directly with video paths
```bash
node main.js video1.mp4 video2.mp4
```

## Build the Docker image:
```bash
docker build -t video-combiner .
```
## Run the Docker container:
```bash
docker run -it --rm video-combiner
```
#### Explanation of Docker’s -i and -t Flags in docker run
-i (interactive): Keeps STDIN open even if not attached. This means that you can interact with the running process inside the container. For example, if your application is a command-line tool, you might want to keep STDIN open so you can type commands into it.

-t (pseudo-TTY): Allocates a pseudo-TTY, which gives the container a virtual terminal. This is useful when you want to interact with the container as if it were a real terminal.

Together, -i -t allow you to interactively run a command in the container, similar to running a command on your local machine. 

# To run the docker via cli path
```bash
docker run -it --rm -v $(pwd):/app video-combiner main.js /path/to/video1.mp4 /path/to/video2.mp4 /path/to/video3.mp4
```

# Run Docker Container and Combine Videos:
```bash
docker run -it --rm -v $(pwd):/app video-combiner main.js --file /path/to/videos.txt
```