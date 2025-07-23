export interface FaceFilter {
  id: string;
  name: string;
  icon: string;
  description: string;
  category: 'fun' | 'beauty' | 'effects' | 'romantic';
  isPremium: boolean;
  cssFilter?: string;
  canvasEffect?: (ctx: CanvasRenderingContext2D, video: HTMLVideoElement) => void;
}

export const faceFilters: FaceFilter[] = [
  // Fun Filters
  {
    id: 'none',
    name: 'No Filter',
    icon: '🚫',
    description: 'Original video',
    category: 'fun',
    isPremium: false,
  },
  {
    id: 'vintage',
    name: 'Vintage',
    icon: '📷',
    description: 'Classic vintage look',
    category: 'effects',
    isPremium: false,
    cssFilter: 'sepia(0.8) contrast(1.2) brightness(1.1)',
  },
  {
    id: 'black-white',
    name: 'Black & White',
    icon: '⚫',
    description: 'Classic monochrome',
    category: 'effects',
    isPremium: false,
    cssFilter: 'grayscale(1) contrast(1.1)',
  },
  
  // ULTRA+ Premium Filters
  {
    id: 'heart-eyes',
    name: 'Heart Eyes',
    icon: '😍',
    description: 'Add heart eyes effect',
    category: 'romantic',
    isPremium: true,
    canvasEffect: drawHeartEyes,
  },
  {
    id: 'flower-crown',
    name: 'Flower Crown',
    icon: '🌸',
    description: 'Beautiful flower crown',
    category: 'romantic',
    isPremium: true,
    canvasEffect: drawFlowerCrown,
  },
  {
    id: 'sparkles',
    name: 'Sparkles',
    icon: '✨',
    description: 'Magical sparkle effect',
    category: 'romantic',
    isPremium: true,
    canvasEffect: drawSparkles,
  },
  {
    id: 'soft-glow',
    name: 'Soft Glow',
    icon: '🌟',
    description: 'Romantic soft glow',
    category: 'beauty',
    isPremium: true,
    cssFilter: 'brightness(1.1) contrast(0.9) blur(0.5px)',
  },
  {
    id: 'rose-tint',
    name: 'Rose Tint',
    icon: '🌹',
    description: 'Romantic rose color',
    category: 'romantic',
    isPremium: true,
    cssFilter: 'hue-rotate(15deg) saturate(1.2) brightness(1.05)',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    icon: '💭',
    description: 'Dreamy romantic effect',
    category: 'romantic',
    isPremium: true,
    cssFilter: 'contrast(0.8) brightness(1.2) saturate(1.1) blur(0.3px)',
  },
  {
    id: 'golden-hour',
    name: 'Golden Hour',
    icon: '🌅',
    description: 'Warm golden lighting',
    category: 'beauty',
    isPremium: true,
    cssFilter: 'sepia(0.3) saturate(1.3) brightness(1.1) hue-rotate(15deg)',
  },
  {
    id: 'neon-glow',
    name: 'Neon Glow',
    icon: '💫',
    description: 'Futuristic neon effect',
    category: 'effects',
    isPremium: true,
    cssFilter: 'contrast(1.5) saturate(2) hue-rotate(180deg) brightness(1.2)',
  },
];

// Canvas effect functions for advanced filters
function drawHeartEyes(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
  const canvas = ctx.canvas;
  const heartSize = Math.min(canvas.width, canvas.height) * 0.08;
  
  // Draw hearts over eyes (approximate positions)
  const leftEyeX = canvas.width * 0.35;
  const rightEyeX = canvas.width * 0.65;
  const eyeY = canvas.height * 0.4;
  
  ctx.font = `${heartSize}px Arial`;
  ctx.fillText('💖', leftEyeX - heartSize/2, eyeY);
  ctx.fillText('💖', rightEyeX - heartSize/2, eyeY);
}

function drawFlowerCrown(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
  const canvas = ctx.canvas;
  const flowerSize = Math.min(canvas.width, canvas.height) * 0.06;
  
  // Draw flowers across the top of the head
  const flowers = ['🌸', '🌺', '🌻', '🌷', '🌹'];
  const numFlowers = 5;
  
  for (let i = 0; i < numFlowers; i++) {
    const x = (canvas.width / (numFlowers + 1)) * (i + 1);
    const y = canvas.height * 0.15;
    const flower = flowers[i % flowers.length];
    
    ctx.font = `${flowerSize}px Arial`;
    ctx.fillText(flower, x - flowerSize/2, y);
  }
}

function drawSparkles(ctx: CanvasRenderingContext2D, video: HTMLVideoElement) {
  const canvas = ctx.canvas;
  const sparkleSize = Math.min(canvas.width, canvas.height) * 0.03;
  
  // Draw random sparkles
  const sparkles = ['✨', '⭐', '💫', '🌟'];
  const numSparkles = 8;
  
  for (let i = 0; i < numSparkles; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const sparkle = sparkles[Math.floor(Math.random() * sparkles.length)];
    
    ctx.font = `${sparkleSize}px Arial`;
    ctx.globalAlpha = 0.7 + Math.random() * 0.3;
    ctx.fillText(sparkle, x, y);
  }
  ctx.globalAlpha = 1;
}

export class FaceFilterService {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private video: HTMLVideoElement;
  private currentFilter: FaceFilter | null = null;
  private animationFrame: number | null = null;

  constructor(video: HTMLVideoElement) {
    this.video = video;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
    
    // Set canvas size to match video
    this.canvas.width = video.videoWidth || 640;
    this.canvas.height = video.videoHeight || 480;
  }

  applyFilter(filter: FaceFilter) {
    this.currentFilter = filter;
    
    if (filter.id === 'none') {
      this.stopFilter();
      return;
    }

    if (filter.cssFilter) {
      this.video.style.filter = filter.cssFilter;
    }

    if (filter.canvasEffect) {
      this.startCanvasEffect();
    }
  }

  private startCanvasEffect() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }

    const animate = () => {
      if (!this.currentFilter?.canvasEffect) return;

      // Update canvas size if video size changed
      if (this.canvas.width !== this.video.videoWidth || 
          this.canvas.height !== this.video.videoHeight) {
        this.canvas.width = this.video.videoWidth || 640;
        this.canvas.height = this.video.videoHeight || 480;
      }

      // Clear canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      
      // Draw video frame
      this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
      
      // Apply canvas effect
      this.currentFilter.canvasEffect(this.ctx, this.video);
      
      this.animationFrame = requestAnimationFrame(animate);
    };

    animate();
  }

  stopFilter() {
    this.currentFilter = null;
    this.video.style.filter = '';
    
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  getFilteredStream(): MediaStream | null {
    if (!this.currentFilter || !this.currentFilter.canvasEffect) {
      return null;
    }

    // Return canvas stream for canvas-based effects
    return this.canvas.captureStream(30);
  }

  destroy() {
    this.stopFilter();
  }
}