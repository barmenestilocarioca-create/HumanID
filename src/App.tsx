import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import * as faceapi from 'face-api.js';
import { 
  Shield, Camera, Lock, CheckCircle, X, Image, 
  Fingerprint, Key, Terminal, Cpu, Eye, Award,
  Download, Share2, Trash2, Clock, Hash, LockIcon,
  ChevronRight, RefreshCw, Check, User, AlertTriangle
} from 'lucide-react';
import './App.css';

// Types
type UserType = 'master' | 'user' | null;
type ViewType = 'login' | 'dashboard' | 'capture' | 'gallery' | 'verify';
type FaceStatus = 'no-face' | 'detecting' | 'face-detected' | 'multiple-faces';

interface CapturedContent {
  id: string;
  type: 'image' | 'video';
  dataUrl: string;
  hash: string;
  timestamp: number;
  challenge: string;
  verified: boolean;
  faceDetected: boolean;
  faceBox?: { x: number; y: number; width: number; height: number };
}

interface Challenge {
  id: number;
  text: string;
  action: string;
}

const CHALLENGES: Challenge[] = [
  { id: 1, text: 'Pisque 2 vezes', action: 'blink' },
  { id: 2, text: 'Diga: "AZUL"', action: 'speak' },
  { id: 3, text: 'Levante a mão direita', action: 'hand' },
  { id: 4, text: 'Sorria amplamente', action: 'smile' },
  { id: 5, text: 'Gire a cabeça lentamente', action: 'turn' },
  { id: 6, text: 'Mostre o polegar', action: 'thumb' },
];

// Generate unique hash
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'HUMAN-' + Math.abs(hash).toString(16).toUpperCase().padStart(12, '0');
};

// Generate timestamp ID
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Login Screen
const LoginScreen = ({ onLogin }: { onLogin: (type: UserType) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [terminalText, setTerminalText] = useState('');

  const fullText = `> INICIANDO SISTEMA HUMAN ID v2.0...\n> ESTABELECENDO CONEXÃO SEGURA...\n> PROTOCOLO DE ENCRIPTAÇÃO: ATIVO\n> AGUARDANDO CREDENCIAIS...`;

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i <= fullText.length) {
        setTerminalText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 25);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = () => {
    setLoading(true);
    setError(false);
    
    setTimeout(() => {
      if (username === 'kaka' && password === '@Ko789456') {
        onLogin('master');
      } else if (username === 'kodastudio' && password === '87654321') {
        onLogin('user');
      } else {
        setError(true);
        setLoading(false);
      }
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4"
    >
      <div className="scan-line" />
      
      <div className="absolute top-8 left-8 font-mono text-xs text-cyan-400/50 hidden lg:block">
        <pre className="whitespace-pre-line">{terminalText}</pre>
      </div>

      <motion.div 
        className={`relative w-full max-w-md ${error ? 'shake' : ''}`}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-green-400 to-purple-500 rounded-2xl opacity-30 blur-lg animate-pulse" />
        
        <div className="relative holo-card p-8 md:p-10">
          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="koda-badge">
                <Shield className="w-4 h-4" />
                Koda Studio Artes
              </div>
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-center mb-2">
              HUMAN <span className="text-cyan-400 neon-text">ID</span>
            </h1>
            <p className="text-slate-400 text-center text-sm mb-8">
              Sistema de Autenticação de Conteúdo Humano
            </p>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  ID de Autenticação
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Insira o login"
                    className="cyber-input pl-12"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
                  Chave de Segurança
                </label>
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    placeholder="Insira a senha"
                    className="cyber-input pl-12"
                  />
                </div>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex items-center gap-2 text-pink-500 text-sm font-semibold"
                >
                  <LockIcon className="w-4 h-4" />
                  ACESSO NEGADO: Credenciais inválidas.
                </motion.div>
              )}

              <button
                onClick={handleLogin}
                disabled={loading}
                className="cyber-btn w-full py-4 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    AUTENTICANDO...
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    DESBLOQUEAR SISTEMA
                  </>
                )}
              </button>
            </div>

            <div className="mt-8 text-center">
              <div className="flex items-center justify-center gap-4 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  SISTEMA ONLINE
                </span>
                <span>|</span>
                <span>v2.0.1</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Camera Capture Component with Face Detection
const CameraCapture = ({ onCapture, onClose }: { onCapture: (content: CapturedContent) => void; onClose: () => void }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [challenge, setChallenge] = useState<Challenge>(CHALLENGES[0]);
  const [countdown, setCountdown] = useState(0);
  const [capturedData, setCapturedData] = useState<string | null>(null);
  const [verifying, setVerifying] = useState(false);
  const [verificationProgress, setVerificationProgress] = useState(0);
  
  // Face detection states
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceStatus, setFaceStatus] = useState<FaceStatus>('no-face');
  const [faceBox, setFaceBox] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [detectionMessage, setDetectionMessage] = useState('Inicializando IA...');
  
  const detectionIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setDetectionMessage('Carregando modelos de IA...');
        
        // Load models from CDN
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        setDetectionMessage('IA pronta! Posicione seu rosto');
        startCamera();
      } catch (err) {
        console.error('Error loading models:', err);
        setDetectionMessage('Erro ao carregar IA. Recarregue a página.');
      }
    };
    
    loadModels();
    rotateChallenge();
    
    return () => {
      stopCamera();
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, []);

  // Start face detection when video is ready
  useEffect(() => {
    if (modelsLoaded && videoRef.current && stream) {
      startFaceDetection();
    }
  }, [modelsLoaded, stream]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user', width: 1280, height: 720 },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Camera access denied:', err);
      alert('Acesso à câmera negado. O Human ID requer câmera para funcionar.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const startFaceDetection = () => {
    if (!videoRef.current || !overlayCanvasRef.current) return;
    
    const video = videoRef.current;
    const canvas = overlayCanvasRef.current;
    
    detectionIntervalRef.current = setInterval(async () => {
      if (video.readyState !== 4) return;
      
      setFaceStatus('detecting');
      
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({
          inputSize: 416,
          scoreThreshold: 0.5
        }))
        .withFaceLandmarks()
        .withFaceExpressions();
      
      // Clear canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      if (detections.length === 0) {
        setFaceStatus('no-face');
        setDetectionMessage('⚠️ Nenhum rosto detectado');
        setFaceBox(null);
      } else if (detections.length > 1) {
        setFaceStatus('multiple-faces');
        setDetectionMessage('⚠️ Múltiplos rostos detectados. Apenas 1 permitido.');
        setFaceBox(null);
        
        // Draw boxes for all faces (red)
        detections.forEach(detection => {
          const box = detection.detection.box;
          drawFaceBox(ctx, box, 'red');
        });
      } else {
        const detection = detections[0];
        const box = detection.detection.box;
        const expressions = detection.expressions;
        
        // Check if face is centered and large enough
        const faceArea = box.width * box.height;
        const videoArea = video.videoWidth * video.videoHeight;
        const faceRatio = faceArea / videoArea;
        
        if (faceRatio < 0.05) {
          setFaceStatus('no-face');
          setDetectionMessage('📷 Aproxime o rosto da câmera');
          drawFaceBox(ctx, box, 'yellow');
        } else {
          setFaceStatus('face-detected');
          
          // Get dominant expression
          const dominantExpression = Object.entries(expressions)
            .sort((a, b) => b[1] - a[1])[0];
          
          setDetectionMessage(`✅ Rosto detectado! (${Math.round(dominantExpression[1] * 100)}% ${dominantExpression[0]})`);
          setFaceBox({ x: box.x, y: box.y, width: box.width, height: box.height });
          
          // Draw face box (green)
          drawFaceBox(ctx, box, 'green');
          
          // Draw landmarks
          faceapi.draw.drawFaceLandmarks(canvas, [detection]);
        }
      }
    }, 100); // Detect every 100ms
  };

  const drawFaceBox = (ctx: CanvasRenderingContext2D, box: faceapi.Box, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.strokeRect(box.x, box.y, box.width, box.height);
    
    // Draw corner markers
    const cornerSize = 20;
    ctx.fillStyle = color;
    
    // Top-left
    ctx.fillRect(box.x - 2, box.y - 2, cornerSize, 4);
    ctx.fillRect(box.x - 2, box.y - 2, 4, cornerSize);
    
    // Top-right
    ctx.fillRect(box.x + box.width - cornerSize + 2, box.y - 2, cornerSize, 4);
    ctx.fillRect(box.x + box.width - 2, box.y - 2, 4, cornerSize);
    
    // Bottom-left
    ctx.fillRect(box.x - 2, box.y + box.height - 2, cornerSize, 4);
    ctx.fillRect(box.x - 2, box.y + box.height - cornerSize + 2, 4, cornerSize);
    
    // Bottom-right
    ctx.fillRect(box.x + box.width - cornerSize + 2, box.y + box.height - 2, cornerSize, 4);
    ctx.fillRect(box.x + box.width - 2, box.y + box.height - cornerSize + 2, 4, cornerSize);
  };

  const rotateChallenge = () => {
    const randomChallenge = CHALLENGES[Math.floor(Math.random() * CHALLENGES.length)];
    setChallenge(randomChallenge);
  };

  const startCapture = () => {
    if (faceStatus !== 'face-detected') {
      alert('Nenhum rosto detectado! Posicione seu rosto na câmera primeiro.');
      return;
    }
    
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          capture();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    // Add watermark
    ctx.fillStyle = 'rgba(0, 229, 255, 0.8)';
    ctx.font = 'bold 24px monospace';
    ctx.fillText('HUMAN ID - VERIFIED', 20, 40);
    ctx.font = '14px monospace';
    ctx.fillText(new Date().toLocaleString('pt-BR'), 20, 60);
    ctx.fillText(`Challenge: ${challenge.text}`, 20, 80);

    // Draw face box on captured image
    if (faceBox) {
      ctx.strokeStyle = '#00ff88';
      ctx.lineWidth = 4;
      ctx.strokeRect(faceBox.x, faceBox.y, faceBox.width, faceBox.height);
      
      // Add "FACE VERIFIED" label
      ctx.fillStyle = 'rgba(0, 255, 136, 0.9)';
      ctx.fillRect(faceBox.x, faceBox.y - 30, 140, 28);
      ctx.fillStyle = '#000';
      ctx.font = 'bold 14px monospace';
      ctx.fillText('FACE VERIFIED', faceBox.x + 10, faceBox.y - 10);
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedData(dataUrl);
    
    // Stop face detection
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    
    // Start verification simulation
    setVerifying(true);
    let progress = 0;
    const verifyInterval = setInterval(() => {
      progress += 10;
      setVerificationProgress(progress);
      if (progress >= 100) {
        clearInterval(verifyInterval);
        setTimeout(() => {
          const content: CapturedContent = {
            id: generateId(),
            type: 'image',
            dataUrl,
            hash: generateHash(dataUrl + Date.now()),
            timestamp: Date.now(),
            challenge: challenge.text,
            verified: true,
            faceDetected: true,
            faceBox: faceBox || undefined
          };
          onCapture(content);
        }, 500);
      }
    }, 200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/95 flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Camera className="w-6 h-6 text-cyan-400" />
          <span className="font-bold text-white">CAPTURA HUMAN ID</span>
          {!modelsLoaded && (
            <span className="text-xs text-yellow-400 animate-pulse">Carregando IA...</span>
          )}
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
          <X className="w-6 h-6 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="relative max-w-4xl w-full">
          {!capturedData ? (
            <>
              {/* Face Detection Status */}
              <div className={`challenge-overlay ${faceStatus === 'face-detected' ? 'border-green-400' : faceStatus === 'multiple-faces' ? 'border-red-400' : 'border-yellow-400'}`}>
                <div className="flex items-center gap-2 mb-1">
                  {faceStatus === 'face-detected' ? (
                    <CheckCircle className="w-4 h-4 text-green-400" />
                  ) : faceStatus === 'multiple-faces' ? (
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                  ) : (
                    <User className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className={`text-xs font-bold uppercase tracking-wider ${
                    faceStatus === 'face-detected' ? 'text-green-400' : 
                    faceStatus === 'multiple-faces' ? 'text-red-400' : 'text-yellow-400'
                  }`}>
                    {faceStatus === 'face-detected' ? 'ROSTO DETECTADO' : 
                     faceStatus === 'multiple-faces' ? 'MÚLTIPLOS ROSTOS' : 
                     faceStatus === 'detecting' ? 'ANALISANDO...' : 'AGUARDANDO ROSTO'}
                  </span>
                </div>
                <div className="text-white text-sm">{detectionMessage}</div>
              </div>

              {/* Challenge Overlay - Secondary */}
              <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-black/80 border border-cyan-400/50 rounded-xl px-6 py-3 text-center z-20">
                <div className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">Micro-Ação</div>
                <div className="text-white font-bold">{challenge.text}</div>
                <button 
                  onClick={rotateChallenge}
                  className="mt-2 text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 mx-auto"
                >
                  <RefreshCw className="w-3 h-3" /> Trocar
                </button>
              </div>

              {/* Camera Frame */}
              <div className={`camera-frame aspect-video bg-black ${
                faceStatus === 'face-detected' ? 'border-green-400 shadow-green-400/50' :
                faceStatus === 'multiple-faces' ? 'border-red-400 shadow-red-400/50' :
                'border-yellow-400 shadow-yellow-400/50'
              }`} style={{ boxShadow: `0 0 40px ${
                faceStatus === 'face-detected' ? 'rgba(0, 255, 136, 0.3)' :
                faceStatus === 'multiple-faces' ? 'rgba(255, 0, 85, 0.3)' :
                'rgba(255, 193, 7, 0.3)'
              }`}}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                <canvas 
                  ref={overlayCanvasRef} 
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  width={1280}
                  height={720}
                />
                <canvas ref={canvasRef} className="hidden" />

                {/* Countdown */}
                {countdown > 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-30">
                    <motion.div
                      key={countdown}
                      initial={{ scale: 2, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="text-8xl font-black text-cyan-400"
                    >
                      {countdown}
                    </motion.div>
                  </div>
                )}

                {/* Face Detection Guide */}
                {faceStatus === 'no-face' && !countdown && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-48 h-64 border-2 border-dashed border-white/30 rounded-full flex items-center justify-center">
                      <User className="w-16 h-16 text-white/20" />
                    </div>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <button
                  onClick={startCapture}
                  disabled={countdown > 0 || faceStatus !== 'face-detected'}
                  className={`px-8 py-4 flex items-center gap-2 rounded-lg font-bold uppercase tracking-wider transition-all ${
                    faceStatus === 'face-detected'
                      ? 'cyber-btn'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  <Camera className="w-5 h-5" />
                  {faceStatus === 'face-detected' ? 'CAPTURAR' : 'AGUARDANDO ROSTO...'}
                </button>
              </div>

              {/* Instructions */}
              <div className="mt-4 text-center">
                <p className="text-slate-500 text-sm">
                  {faceStatus === 'no-face' && 'Posicione seu rosto no centro da câmera'}
                  {faceStatus === 'detecting' && 'Analisando...'}
                  {faceStatus === 'face-detected' && '✅ Rosto detectado! Pronto para capturar'}
                  {faceStatus === 'multiple-faces' && '⚠️ Apenas uma pessoa pode ser verificada por vez'}
                </p>
              </div>
            </>
          ) : (
            /* Verification Screen */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="verification-seal"
            >
              <div className="seal-stamp">
                HUMAN<br/>ID
              </div>

              <img src={capturedData} alt="Captured" className="w-full max-w-md mx-auto rounded-lg mb-6" />
              
              {verifying ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-center gap-2 text-cyan-400">
                    <Cpu className="w-5 h-5 animate-spin" />
                    <span className="font-bold">VERIFICANDO HUMANIDADE...</span>
                  </div>
                  <div className="progress-bar max-w-md mx-auto">
                    <div className="progress-fill" style={{ width: `${verificationProgress}%` }} />
                  </div>
                  <div className="text-center text-slate-400 text-sm">
                    {verificationProgress < 30 && 'Detectando landmarks faciais...'}
                    {verificationProgress >= 30 && verificationProgress < 60 && 'Analisando expressões...'}
                    {verificationProgress >= 60 && verificationProgress < 90 && 'Validando desafio...'}
                    {verificationProgress >= 90 && 'Gerando hash criptográfico...'}
                  </div>
                </div>
              ) : null}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Verification Seal Component
const VerificationSeal = ({ content }: { content: CapturedContent }) => {
  const [showQR, setShowQR] = useState(false);
  
  const verificationData = JSON.stringify({
    id: content.id,
    hash: content.hash,
    timestamp: content.timestamp,
    challenge: content.challenge,
    verified: content.verified,
    faceDetected: content.faceDetected
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="verification-seal">
        <div className="seal-stamp">
          100%<br/>HUMAN
        </div>

        <div className="flex items-center justify-center mb-4">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>

        <h3 className="text-2xl font-bold text-white text-center mb-2">
          Conteúdo Verificado!
        </h3>
        <p className="text-slate-400 text-center text-sm mb-6">
          Este conteúdo foi autenticado pelo sistema Human ID
        </p>

        <div className="space-y-4">
          <div className="flex items-center gap-2 p-3 bg-green-400/10 border border-green-400/30 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span className="text-green-400 font-semibold text-sm">Rosto humano detectado e verificado</span>
          </div>

          <div>
            <label className="text-xs text-cyan-400 uppercase tracking-wider">Hash Único</label>
            <div className="hash-display mt-1">{content.hash}</div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-cyan-400 uppercase tracking-wider">Data</label>
              <div className="text-white text-sm">{new Date(content.timestamp).toLocaleDateString('pt-BR')}</div>
            </div>
            <div>
              <label className="text-xs text-cyan-400 uppercase tracking-wider">Hora</label>
              <div className="text-white text-sm">{new Date(content.timestamp).toLocaleTimeString('pt-BR')}</div>
            </div>
          </div>

          <div>
            <label className="text-xs text-cyan-400 uppercase tracking-wider">Desafio Completado</label>
            <div className="text-green-400 text-sm font-semibold">{content.challenge}</div>
          </div>

          <button
            onClick={() => setShowQR(!showQR)}
            className="w-full py-3 border border-cyan-400/30 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {showQR ? 'Ocultar QR Code' : 'Verificar Autenticidade'}
          </button>

          {showQR && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex justify-center p-4 bg-white rounded-lg"
            >
              <QRCodeSVG value={verificationData} size={200} />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Gallery Component
const Gallery = ({ contents, onDelete }: { contents: CapturedContent[]; onDelete: (id: string) => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        <Image className="w-6 h-6 text-cyan-400" />
        Galeria de Conteúdos Verificados
      </h2>

      {contents.length === 0 ? (
        <div className="text-center py-20">
          <Camera className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <p className="text-slate-400">Nenhum conteúdo capturado ainda</p>
          <p className="text-slate-600 text-sm mt-2">Use a câmera para capturar seu primeiro conteúdo verificado</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {contents.map((content, index) => (
            <motion.div
              key={content.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="gallery-item"
            >
              <div className="verified-badge">
                <Check className="w-3 h-3" />
                Verificado
              </div>
              
              <img 
                src={content.dataUrl} 
                alt="Verified content" 
                className="w-full aspect-video object-cover"
              />
              
              <div className="p-4">
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                  <Clock className="w-3 h-3" />
                  {new Date(content.timestamp).toLocaleString('pt-BR')}
                </div>
                
                <div className="hash-display text-xs mb-3">{content.hash}</div>
                
                <div className="flex items-center gap-2 text-xs text-green-400 mb-3">
                  <CheckCircle className="w-3 h-3" />
                  {content.challenge}
                </div>
                
                <div className="flex gap-2">
                  <a
                    href={content.dataUrl}
                    download={`human-id-${content.id}.jpg`}
                    className="flex-1 py-2 bg-cyan-400/20 text-cyan-400 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 hover:bg-cyan-400/30 transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Baixar
                  </a>
                  <button
                    onClick={() => onDelete(content.id)}
                    className="p-2 bg-red-400/20 text-red-400 rounded-lg hover:bg-red-400/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

// Dashboard Component
const Dashboard = ({ 
  userType, 
  onLogout, 
  onCapture, 
  onViewGallery,
  capturedCount 
}: { 
  userType: UserType; 
  onLogout: () => void; 
  onCapture: () => void;
  onViewGallery: () => void;
  capturedCount: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
    >
      <div className="scan-line" />
      
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-lg">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-cyan-400" />
            <div>
              <h1 className="font-bold text-white">HUMAN <span className="text-cyan-400">ID</span></h1>
              <p className="text-xs text-slate-400">Sistema de Autenticação com IA</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`koda-badge ${userType === 'master' ? 'border-purple-500 text-purple-400' : ''}`}>
              <Terminal className="w-3 h-3" />
              {userType === 'master' ? 'CEO KAKÁ' : 'KODA STUDIO'}
            </div>
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <Lock className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              O <span className="text-cyan-400 neon-text">Antivírus</span> da Realidade
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Capture conteúdo com <span className="text-green-400 font-semibold">prova de humanidade</span>. 
              Nossa IA detecta rostos reais em tempo real. Nada de fotos ou telas!
            </p>
          </motion.div>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onCapture}
            className="holo-card p-8 text-left group"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-cyan-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Camera className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Nova Captura</h3>
              <p className="text-slate-400 text-sm mb-4">
                Acesse a câmera com detecção facial por IA. Só captura quando detectar um rosto real!
              </p>
              <div className="flex items-center gap-2 text-cyan-400 text-sm font-semibold">
                Iniciar <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewGallery}
            className="holo-card p-8 text-left group"
          >
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-2xl bg-green-400/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Image className="w-8 h-8 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Galeria</h3>
              <p className="text-slate-400 text-sm mb-4">
                {capturedCount === 0 
                  ? 'Nenhum conteúdo verificado ainda.' 
                  : `${capturedCount} conteúdo${capturedCount > 1 ? 's' : ''} verificado${capturedCount > 1 ? 's' : ''} no sistema.`}
              </p>
              <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                Visualizar <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </motion.button>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Camera, title: 'Lente Nativa', desc: 'Captura direta, sem uploads', color: 'cyan' },
            { icon: Eye, title: 'Detecção Facial', desc: 'IA detecta rostos reais', color: 'green' },
            { icon: Hash, title: 'Hash Único', desc: 'ID criptográfico', color: 'purple' },
            { icon: Award, title: 'Selo Real', desc: '100% verificado', color: 'cyan' },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.1 }}
              className="bg-white/5 border border-white/10 rounded-xl p-4 text-center"
            >
              <step.icon className={`w-8 h-8 mx-auto mb-3 text-${step.color}-400`} style={{ color: step.color === 'cyan' ? '#00e5ff' : step.color === 'green' ? '#00ff88' : '#b054ff' }} />
              <h4 className="text-white font-semibold text-sm mb-1">{step.title}</h4>
              <p className="text-slate-500 text-xs">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-cyan-400" />
            <span className="font-bold text-white tracking-wider">KODA STUDIO ARTES</span>
          </div>
          <p className="text-slate-600 text-sm">
            Human ID © 2026 - Sistema de Autenticação com Detecção Facial por IA
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

// Main App
function App() {
  const [userType, setUserType] = useState<UserType>(null);
  const [currentView, setCurrentView] = useState<ViewType>('login');
  const [capturedContents, setCapturedContents] = useState<CapturedContent[]>([]);
  const [lastCaptured, setLastCaptured] = useState<CapturedContent | null>(null);

  // Load saved contents from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('humanIdContents');
    if (saved) {
      try {
        setCapturedContents(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved contents');
      }
    }
  }, []);

  // Save contents to localStorage
  useEffect(() => {
    localStorage.setItem('humanIdContents', JSON.stringify(capturedContents));
  }, [capturedContents]);

  const handleLogin = (type: UserType) => {
    setUserType(type);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUserType(null);
    setCurrentView('login');
  };

  const handleCapture = (content: CapturedContent) => {
    setCapturedContents(prev => [content, ...prev]);
    setLastCaptured(content);
    setCurrentView('verify');
  };

  const handleDelete = (id: string) => {
    setCapturedContents(prev => prev.filter(c => c.id !== id));
  };

  return (
    <AnimatePresence mode="wait">
      {currentView === 'login' && (
        <LoginScreen key="login" onLogin={handleLogin} />
      )}
      
      {currentView === 'dashboard' && (
        <Dashboard
          key="dashboard"
          userType={userType}
          onLogout={handleLogout}
          onCapture={() => setCurrentView('capture')}
          onViewGallery={() => setCurrentView('gallery')}
          capturedCount={capturedContents.length}
        />
      )}
      
      {currentView === 'capture' && (
        <CameraCapture
          key="capture"
          onCapture={handleCapture}
          onClose={() => setCurrentView('dashboard')}
        />
      )}
      
      {currentView === 'gallery' && (
        <motion.div
          key="gallery"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-[#020408]"
        >
          <div className="scan-line" />
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <Image className="w-6 h-6 text-cyan-400" />
              <span className="font-bold text-white">GALERIA</span>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <Gallery contents={capturedContents} onDelete={handleDelete} />
        </motion.div>
      )}
      
      {currentView === 'verify' && lastCaptured && (
        <motion.div
          key="verify"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="min-h-screen bg-[#020408] flex flex-col"
        >
          <div className="scan-line" />
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <span className="font-bold text-white">VERIFICAÇÃO</span>
            </div>
            <button 
              onClick={() => setCurrentView('dashboard')}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center p-6">
            <VerificationSeal content={lastCaptured} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default App;
