const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function hasAudio(filePath) {
  try {
    const output = execSync(
      `ffprobe -i "${filePath}" -show_streams -select_streams a -loglevel error`
    ).toString();
    return output.includes('codec_type=audio');
  } catch {
    return false;
  }
}

function addSilentAudio(input, output) {
  console.log(`Adding silent audio to: ${path.basename(input)}`);
  execSync(
    `ffmpeg -y -i "${input}" -f lavfi -t $(ffprobe -v error -show_entries format=duration -of csv=p=0 "${input}") -i anullsrc=channel_layout=stereo:sample_rate=44100 -c:v copy -shortest "${output}"`,
    { stdio: 'inherit' }
  );
}

function combineVideos(videoPaths, outputPath) {
  // Create temp versions with audio if missing
  const processedVideos = videoPaths.map((file, index) => {
    const absPath = path.resolve(file);
    if (hasAudio(absPath)) {
      return absPath; // keep original
    } else {
      const tempFile = path.join(__dirname, `temp_with_audio_${index}.mp4`);
      addSilentAudio(absPath, tempFile);
      return tempFile;
    }
  });

  // Create file list for ffmpeg concat
  const listFilePath = path.join(__dirname, 'file_list.txt');
  const listContent = processedVideos.map(v => `file '${v}'`).join('\n');
  fs.writeFileSync(listFilePath, listContent);

  // Concat videos
  console.log('Combining videos...');
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${listFilePath}" -c copy "${outputPath}"`,
    { stdio: 'inherit' }
  );

  // Clean up
  fs.unlinkSync(listFilePath);
  processedVideos.forEach(file => {
    if (file.includes('temp_with_audio_')) fs.unlinkSync(file);
  });

  console.log(`✅ Videos combined successfully to ${outputPath}`);
}

const args = process.argv.slice(2);
let videoPaths;

if (args.includes('--file')) {
  const filePath = args[args.indexOf('--file') + 1];
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    videoPaths = fileContent.split('\n').filter(line => line.trim() !== '');
    videoPaths = videoPaths.map(videoPath => path.resolve(__dirname, videoPath));
  } catch (error) {
    console.error(`Error reading file: ${error.message}`);
    return;
  }
} else if (args.length > 0) {
  videoPaths = args.map(arg => path.resolve(__dirname, arg));
} else {
  console.error('No video paths provided. Use --file <path_to_file> or provide video paths directly.');
  return;
}

const outputPath = path.join(__dirname, 'combined_video.mp4');

combineVideos(videoPaths, outputPath);