import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Music, Mail, Camera, Play, Pause, Heart, Gift, Lock, ChevronLeft, ChevronRight } from 'lucide-react';
import confetti from 'canvas-confetti';

// Placeholder GIFs
const GIFS = {
  sideEye: '/images/sideeye.jpg',
  kiss: '/images/6ac51b2b-49b6-4f51-b277-e21d86fc032d.webp',
  love: '/images/valentine.jpg',
};

const AUDIO_ASSETS = {
  'Enthaaraa Enthaaraa': '/music/Enthaaraa.mp3',
  'kanaa kaangiren': '/music/Kanaa.mp3',
  'Oru Parvaiyil': '/music/OruParvaiyil.mp3'
};

const PROS_TEXTS = [
  "I make great pasta and I'm always on time.",
  "I will always support your dreams no matter what.",
  "I give the best hugs in the entire world (verified).",
  "I remember the little details you tell me.",
  "I'm pretty good at killing spiders for you.",
];

const BackgroundHearts = () => {
  const hearts = Array.from({ length: 25 });
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-70">
      {hearts.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            scale: Math.random() * 0.5 + 0.3,
            x: Math.random() * 120 + "%",
            y: Math.random() * 120 + "%"
          }}
          animate={{
            opacity: [0, 0.6, 0],
            x: ["0%", "-30%"],
            y: ["0%", "-30%"],
          }}
          transition={{
            duration: Math.random() * 15 + 10,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 20
          }}
          className="absolute text-pink-400"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            filter: "blur(0.3px)"
          }}
        >
          <Heart size={Math.random() * 35 + 15} fill="currentColor" />
        </motion.div>
      ))}
    </div>
  );
};

function App() {
  const [screen, setScreen] = useState('LANDING'); // LANDING, AFTER_NO, YES_PAGE, GIFT_MENU, GIFT_1, GIFT_2, GIFT_3, SUCCESS
  const [showNoModal, setShowNoModal] = useState(false);
  const [proIndex, setProIndex] = useState(0);
  const [isGift2Open, setIsGift2Open] = useState(false);
  const [isHoveringNo, setIsHoveringNo] = useState(false);
  const [viewedGifts, setViewedGifts] = useState({ ears: false, heart: false });
  const [playingSong, setPlayingSong] = useState(null);
  const [audio, setAudio] = useState(null);

  // Modal handlers
  const handleNoClick = () => setShowNoModal(true);
  const handleCloseModal = () => {
    setShowNoModal(false);
    if (screen === 'LANDING') setScreen('AFTER_NO');
  };

  const handleProClick = () => {
    setProIndex((prev) => (prev + 1) % PROS_TEXTS.length);
  };

  // Navigation
  const toYesPage = () => setScreen('YES_PAGE');
  const toGiftMenu = () => setScreen('GIFT_MENU');

  const toSuccess = () => {
    setScreen('SUCCESS');
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;

    // Create heart shape
    const heart = confetti.shapeFromText({ text: '❤️', scalar: 3 });

    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
      shapes: [heart]
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 40 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleOpenLetter = () => {
    setIsGift2Open(true);
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff69b4', '#ff1493', '#ffc0cb', '#ffffff']
    });
  };

  const toggleSong = (songName) => {
    if (playingSong === songName) {
      audio.pause();
      setPlayingSong(null);
      setAudio(null);
    } else {
      if (audio) audio.pause();
      const newAudio = new Audio(AUDIO_ASSETS[songName.split(' - ')[0]]);
      newAudio.play();
      setPlayingSong(songName);
      setAudio(newAudio);
      newAudio.onended = () => setPlayingSong(null);
    }
  };

  // Reusable Container
  const Container = ({ children, className = "" }) => (
    <div className={`w-full h-full flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all bg-transparent ${className}`}>
      {children}
    </div>
  );

  const renderContent = () => {
    switch (screen) {
      case 'LANDING':
      case 'AFTER_NO':
        return (
          <Container>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center z-10"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-pink-600 mb-8 font-serif drop-shadow-sm">
                Will you be my<br />Valentine?
              </h1>

              <div className="flex gap-4 justify-center items-center mt-8">
                {/* No Button */}
                {screen === 'LANDING' ? (
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleNoClick}
                    className="bg-red-400 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-red-200 hover:bg-red-500 transition-colors"
                  >
                    No
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onMouseEnter={() => setIsHoveringNo(true)}
                    onMouseLeave={() => setIsHoveringNo(false)}
                    onClick={toYesPage}
                    className={`${isHoveringNo ? 'bg-green-500 shadow-green-200' : 'bg-red-400 shadow-red-200'} text-white px-8 py-3 rounded-full font-semibold shadow-lg transition-all duration-300`}
                  >
                    {isHoveringNo ? 'Yessss💖' : 'No'}
                  </motion.button>
                )}

                {/* Yes Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toYesPage}
                  className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg shadow-green-200 hover:bg-green-600 transition-colors"
                >
                  Yes
                </motion.button>
              </div>
            </motion.div>

            {/* Decorative Hearts */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 left-10 text-pink-300"
            >
              <Heart size={48} fill="currentColor" />
            </motion.div>
            <motion.div
              animate={{ y: [0, -30, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 right-10 text-pink-300"
            >
              <Heart size={64} fill="currentColor" />
            </motion.div>
          </Container>
        );

      case 'YES_PAGE':
        return (
          <Container>
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center gap-6"
            >
              <h1 className="text-4xl font-bold text-pink-600 text-center">YAYYYYY! ❤️</h1>
              <div className="w-64 h-64 rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img src={GIFS.kiss} alt="Kiss" className="w-full h-full object-cover" />
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                onClick={toGiftMenu}
                className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-pink-600 flex items-center gap-2 mt-4"
              >
                <Gift size={20} />
                See Your Gifts
              </motion.button>
            </motion.div>
          </Container>
        );

      case 'GIFT_MENU':
        return (
          <Container>
            <h2 className="text-4xl md:text-5xl font-bold text-pink-600 mb-12 text-center">Choose a Gift 🎁</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
              {[
                { id: 'GIFT_1', label: 'For Your Ears', icon: <Music size={40} />, color: 'bg-blue-100 hover:bg-blue-200 text-blue-600', unlocked: true },
                { id: 'GIFT_2', label: 'For Your Heart', icon: <Mail size={40} />, color: viewedGifts.ears ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60', unlocked: viewedGifts.ears },
                { id: 'GIFT_3', label: 'For Your Eyes', icon: <Camera size={40} />, color: viewedGifts.heart ? 'bg-purple-100 hover:bg-purple-200 text-purple-600' : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60', unlocked: viewedGifts.heart }
              ].map((gift) => (
                <motion.button
                  key={gift.id}
                  whileHover={gift.unlocked ? { scale: 1.05, y: -10 } : {}}
                  whileTap={gift.unlocked ? { scale: 0.95 } : {}}
                  onClick={() => {
                    if (gift.unlocked) {
                      if (gift.id === 'GIFT_1') setViewedGifts(prev => ({ ...prev, ears: true }));
                      if (gift.id === 'GIFT_2') setViewedGifts(prev => ({ ...prev, heart: true }));
                      setScreen(gift.id);
                    }
                  }}
                  className={`flex flex-col items-center justify-center p-12 rounded-3xl shadow-md border border-white/50 transition-all ${gift.color} relative overflow-hidden`}
                >
                  {!gift.unlocked && (
                    <div className="absolute top-4 right-4 text-gray-400">
                      <Lock size={20} />
                    </div>
                  )}
                  <div className={`p-6 bg-white rounded-full shadow-md mb-6 ${!gift.unlocked && 'grayscale opacity-50'}`}>
                    {gift.icon}
                  </div>
                  <span className="text-2xl font-bold">{gift.label}</span>
                  {!gift.unlocked && (
                    <span className="text-xs mt-2 uppercase tracking-widest font-bold opacity-60">Locked</span>
                  )}
                </motion.button>
              ))}
            </div>
          </Container>
        );

      case 'GIFT_1': // Songs
        return (
          <Container>
            <div className="w-full max-w-sm bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="bg-blue-500 p-6 text-white text-center relative">
                <Music size={48} className="mx-auto mb-2 opacity-80" />
                <h2 className="text-2xl font-bold">Our Playlist</h2>
                <p className="text-blue-100 text-sm">Songs that remind me of you</p>
              </div>
              <div className="p-6 flex flex-col gap-4">
                {[
                  'Enthaaraa Enthaaraa - Thirumanam Enum Nikkah',
                  'kanaa kaangiren - Aanandha Thandavam',
                  'Oru Parvaiyil - Siva Manasula Sakthi'
                ].map((song, i) => (
                  <div
                    key={i}
                    onClick={() => toggleSong(song)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer group shadow-sm border ${playingSong === song ? 'bg-blue-100 border-blue-200' : 'bg-gray-50 border-gray-100 hover:bg-gray-100'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${playingSong === song ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-500'}`}>
                        {playingSong === song ? <Pause size={14} fill="currentColor" /> : i + 1}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-medium text-sm ${playingSong === song ? 'text-blue-700' : 'text-gray-800'}`}>{song.split(' - ')[0]}</span>
                        <span className="text-xs text-gray-400">{song.split(' - ')[1]}</span>
                      </div>
                    </div>
                    <button className={`${playingSong === song ? 'text-blue-500' : 'text-gray-400'} hover:text-blue-500 group-hover:scale-110 transition-all`}>
                      {playingSong === song ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
                    </button>
                  </div>
                ))}
              </div>
              <div className="p-6 pt-0">
                <button
                  onClick={toGiftMenu}
                  className="w-full py-3 bg-gray-100 text-gray-600 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back
                </button>
              </div>
            </div>
          </Container>
        );

      case 'GIFT_2': // Letter
        return (
          <Container>
            <AnimatePresence mode="wait">
              {!isGift2Open ? (
                <motion.div
                  key="closed"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 1.2, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                    onClick={handleOpenLetter}
                    className="w-64 h-40 bg-pink-100 border-4 border-pink-300 rounded-xl shadow-xl flex items-center justify-center relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-orange-100"></div>
                    <Heart size={48} className="text-pink-400 z-10 drop-shadow-md" fill="currentColor" />
                    <span className="absolute bottom-4 text-pink-500 font-bold text-sm tracking-widest uppercase">Open Me</span>
                  </motion.button>
                  <button onClick={toGiftMenu} className="mt-8 text-gray-400 hover:text-gray-600 underline">Back</button>
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full mx-4 relative paper-texture"
                >
                  <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-200 rounded-full opacity-50"></div>
                  <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-pink-200 rounded-full opacity-50"></div>

                  <h3 className="text-2xl font-serif text-gray-800 mb-4 font-bold border-b pb-2">My Dearest,</h3>
                  <p className="text-gray-600 leading-relaxed font-serif text-sm">
                    On this Valentine’s Day, I just want to say thank you for loving me the way you do. You understand me, support me, and believe in me even when I doubt myself.
                    <br /><br />
                    You are my peace, my happiness, and my safe place.
                    <br /><br />
                    No matter what life brings, I want to walk every step with you.
                    <br /><br />
                    Forever yours,
                    <br />
                    <span className="font-bold font-serif text-pink-600 text-lg">Kiruba ❤️</span>
                  </p>
                  <button
                    onClick={() => setIsGift2Open(false)}
                    className="mt-6 w-full py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
                  >
                    Close Letter
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </Container>
        );

      case 'GIFT_3': // Photos
        return (
          <Container>
            <h2 className="text-4xl font-bold text-purple-600 mb-12 font-serif">Us Through Time</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl px-4 items-start">
              {[
                { src: "/images/gift1.jpg", caption: "Sweet Moments" },
                { src: "/images/gift2.jpg", caption: "Forever Together" },
                { src: "/images/gift3.jpg", caption: "Everyday Joy" },
                { src: "/images/gift4.jpg", caption: "Our Journey" }
              ].map((photo, i) => (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.05, rotate: Math.random() * 6 - 3, zIndex: 10 }}
                  className="bg-white p-4 pb-10 shadow-xl rounded-sm transform transition-all cursor-pointer"
                  style={{ rotate: `${Math.random() * 6 - 3}deg` }}
                >
                  <div className="w-full bg-gray-50 flex items-center justify-center overflow-hidden mb-4 rounded-sm shadow-inner group">
                    <img
                      src={photo.src}
                      alt={photo.caption}
                      className="w-full h-auto max-h-[400px] object-contain grayscale-[0.2] transition-all group-hover:grayscale-0"
                    />
                  </div>
                  <div className="text-center">
                    <span className="font-serif text-gray-500 italic text-sm">{photo.caption}</span>
                  </div>
                </motion.div>
              ))}
            </div>
            <button
              onClick={toSuccess}
              className="mt-16 bg-purple-500 text-white px-12 py-4 rounded-full font-bold text-xl shadow-lg hover:bg-purple-600 transition-colors"
            >
              One Last Thing...
            </button>
          </Container>
        );

      case 'SUCCESS':
        return (
          <Container>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
              className="flex flex-col items-center text-center p-6"
            >
              <h1 className="text-5xl font-bold text-red-600 mb-6 font-serif">I LOVE YOU!</h1>
              <div className="max-w-md w-full overflow-hidden shadow-2xl border-4 border-red-100 mb-6 bg-white relative rounded-3xl aspect-[4/5]">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  src={GIFS.love}
                  alt="Love"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: 'center top', scale: 1.25 }}
                />
              </div>
              <p className="text-red-500 font-black text-3xl italic drop-shadow-sm">Happy Valentine's Day! 💖</p>
            </motion.div>
          </Container>
        );

      default:
        return <div>Error: Unknown Screen</div>;
    }
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center overflow-hidden live-gradient">
      <BackgroundHearts />
      <div className="w-full h-full relative overflow-hidden text-black transition-all z-10">
        {/* Render the full-screen content */}
        {renderContent()}

        {/* No Modal Overlay */}
        <AnimatePresence>
          {showNoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.8, y: 50 }}
                className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative"
              >
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                  <X size={20} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Why say no? 🥺</h2>

                <div className="space-y-6">
                  {/* Pros */}
                  <div className="bg-pink-50 p-4 rounded-2xl border border-pink-100">
                    <div className="flex items-center gap-2 mb-2 text-pink-600 font-semibold justify-between">
                      <div className="flex items-center gap-2">
                        <Heart size={16} fill="currentColor" />
                        <span>Reason #{proIndex + 1}</span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setProIndex(prev => Math.max(0, prev - 1))}
                          disabled={proIndex === 0}
                          className={`p-1 rounded-full transition-colors ${proIndex === 0 ? 'text-pink-200 cursor-not-allowed' : 'bg-pink-200 text-pink-700 hover:bg-pink-300'}`}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          onClick={() => setProIndex(prev => Math.min(PROS_TEXTS.length - 1, prev + 1))}
                          disabled={proIndex === PROS_TEXTS.length - 1}
                          className={`p-1 rounded-full transition-colors ${proIndex === PROS_TEXTS.length - 1 ? 'text-pink-200 cursor-not-allowed' : 'bg-pink-200 text-pink-700 hover:bg-pink-300'}`}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-700 min-h-[3rem] mb-3">"{PROS_TEXTS[proIndex]}"</p>
                  </div>

                  {/* Cons */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
                      <img
                        src={GIFS.sideEye}
                        alt="Side Eye"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: 'center top', scale: 1.25 }}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">Cons:</h3>
                      <p className="text-gray-500 text-sm">Literally none. Zero.</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full mt-6 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
                >
                  Okay, I'll reconsider
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;
