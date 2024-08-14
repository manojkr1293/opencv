// utils/opencv.js
export function loadOpencv() {
  return new Promise((resolve, reject) => {
    if (typeof cv !== 'undefined') {
      resolve(cv);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://docs.opencv.org/4.x/opencv.js';
    script.async = true;
    script.onload = () => {
      if (typeof cv !== 'undefined') {
        resolve(cv);
      } else {
        reject(new Error('Failed to load OpenCV.js'));
      }
    };
    script.onerror = () => reject(new Error('Failed to load OpenCV.js'));
    document.body.appendChild(script);
  });
}
