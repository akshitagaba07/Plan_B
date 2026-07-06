import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileAPI } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Camera, User, Tag, Compass, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, updateProfile, updateProfilePicture } = useAuth();
  
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [age, setAge] = useState(22);
  const [gender, setGender] = useState('Other');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [occupation, setOccupation] = useState('');
  const [university, setUniversity] = useState('');
  
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [hobbiesInput, setHobbiesInput] = useState('');
  const [activitiesInput, setActivitiesInput] = useState('');
  const [languagesInput, setLanguagesInput] = useState('');
  
  const [locationLoading, setLocationLoading] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const interestsList = [
    'Gaming', 'Movies', 'Football', 'Cricket', 'Badminton', 
    'Gym', 'Music', 'Anime', 'Travel', 'Books', 
    'Coffee', 'Coding', 'Photography', 'Food', 'Art'
  ];

  useEffect(() => {
    if (user?.profile) {
      const p = user.profile;
      setName(p.name || '');
      setAge(p.age || 22);
      setGender(p.gender || 'Other');
      setCity(p.city || '');
      setBio(p.bio || '');
      setOccupation(p.occupation || '');
      setUniversity(p.university || '');
      setSelectedInterests(p.interests || []);
      setHobbiesInput((p.hobbies || []).join(', '));
      setActivitiesInput((p.favorite_activities || []).join(', '));
      setLanguagesInput((p.languages || []).join(', '));
    }
  }, [user]);

  const toggleInterest = (interest) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(prev => prev.filter(i => i !== interest));
    } else {
      setSelectedInterests(prev => [...prev, interest]);
    }
  };

  const handleLocationDetection = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          let detectedCity = "San Francisco";
          try {
            const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await res.json();
            if (data.city || data.locality) {
              detectedCity = data.city || data.locality;
            }
          } catch (e) {
            console.warn("City name lookup failed, using placeholder coordinates");
          }
          
          await profileAPI.detectLocation(latitude, longitude, detectedCity);
          setCity(detectedCity);
          setSuccessMsg("Location detected and synced successfully!");
          setTimeout(() => setSuccessMsg(''), 3000);
        } catch (err) {
          console.error("Location sync failed:", err);
        } finally {
          setLocationLoading(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setTimeout(async () => {
          await profileAPI.detectLocation(37.7749, -122.4194, "San Francisco");
          setCity("San Francisco");
          setSuccessMsg("Location simulated successfully!");
          setTimeout(() => setSuccessMsg(''), 3000);
          setLocationLoading(false);
        }, 1000);
      }
    );
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setPhotoLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      await updateProfilePicture(formData);
      setSuccessMsg("Profile picture uploaded successfully!");
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error("Picture upload failed:", err);
      alert("Failed to upload image. Please try again.");
    } finally {
      setPhotoLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveLoading(true);

    const hobbies = hobbiesInput.split(',').map(h => h.trim()).filter(h => h !== '');
    const favorite_activities = activitiesInput.split(',').map(a => a.trim()).filter(a => a !== '');
    const languages = languagesInput.split(',').map(l => l.trim()).filter(l => l !== '');

    const profileData = {
      name,
      age: parseInt(age),
      gender,
      city,
      bio,
      occupation,
      university,
      interests: selectedInterests,
      hobbies,
      favorite_activities,
      languages
    };

    try {
      await updateProfile(profileData);
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 }
      });
      setSuccessMsg("Profile saved successfully!");
      setTimeout(() => {
        setSuccessMsg('');
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error("Profile save failed:", err);
      alert("Failed to save profile. Ensure all fields are filled.");
    } finally {
      setSaveLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 relative font-outfit text-white">
      
      {/* Top Banner Message */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            className="fixed top-6 right-6 bg-[#DFFE00] text-black font-extrabold px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 z-50 border border-[#DFFE00]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
          >
            <CheckCircle className="h-5 w-5 shrink-0 stroke-[2.5px]" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Profile Onboarding Header */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl md:text-3xl font-syne font-extrabold uppercase tracking-tight text-white">Setup Your Profile</h2>
        <p className="text-slate-400 font-semibold text-xs md:text-sm">
          Let's tailor Plan B to locate compatible buddies and suggest custom social options.
        </p>

        {/* Step Progress Indicators */}
        <div className="max-w-md mx-auto flex items-center justify-between pt-6 px-4">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center flex-1 last:flex-none">
              <div 
                className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 ${
                  step === s 
                    ? 'bg-[#DFFE00] text-black scale-110 shadow-lg shadow-[#DFFE00]/15' 
                    : step > s 
                      ? 'bg-emerald-500 text-white' 
                      : 'bg-white/10 text-slate-500'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              {s < 3 && (
                <div className={`h-1 flex-1 mx-2 rounded-full transition-colors duration-300 ${step > s ? 'bg-emerald-500' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-8 border-white/5 bg-black/45">
        
        <form onSubmit={handleSave} className="space-y-6">
          <AnimatePresence mode="wait">
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <User className="h-5 w-5 text-[#DFFE00] stroke-[2px]" />
                  <h3 className="font-syne font-extrabold text-base uppercase tracking-wider text-white">Step 1: The Basics</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="glass-input"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Age</label>
                      <input 
                        type="number" 
                        min="16" 
                        max="100"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Gender</label>
                      <select 
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        className="glass-input bg-slate-900"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Non-binary">Non-binary</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Occupation</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Designer, Manager"
                      value={occupation}
                      onChange={(e) => setOccupation(e.target.value)}
                      className="glass-input"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">University</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Stanford University"
                      value={university}
                      onChange={(e) => setUniversity(e.target.value)}
                      className="glass-input"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">About Me (Bio)</label>
                  <textarea 
                    rows="3"
                    placeholder="Tell people a little bit about yourself, what you are looking for, or something interesting you've done lately..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="glass-input resize-none"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 2: Interests & Tags */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-2 pb-4 border-b border-white/5">
                  <Tag className="h-5 w-5 text-[#DFFE00] stroke-[2px]" />
                  <h3 className="font-syne font-extrabold text-base uppercase tracking-wider text-white">Step 2: Interests & Hobbies</h3>
                </div>

                <div className="space-y-3 text-left">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Core Interests</label>
                    <span className="text-[10px] text-slate-500 font-extrabold">Select all that apply</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {interestsList.map((interest) => {
                      const selected = selectedInterests.includes(interest);
                      return (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggleInterest(interest)}
                          className={`text-xs font-bold px-4 py-2.5 rounded-xl border transition-all duration-150 ${
                            selected 
                              ? 'bg-[#DFFE00] text-black border-transparent shadow-sm' 
                              : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white'
                          }`}
                        >
                          {interest}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Hobbies (separated by commas)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Fifa, Trekking, Baking, Photography"
                      value={hobbiesInput}
                      onChange={(e) => setHobbiesInput(e.target.value)}
                      className="glass-input"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Favorite Activities (separated by commas)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Watch movies, play soccer, hit the gym, museum tours"
                      value={activitiesInput}
                      onChange={(e) => setActivitiesInput(e.target.value)}
                      className="glass-input"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Languages You Speak (separated by commas)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. English, Spanish, Hindi, French"
                      value={languagesInput}
                      onChange={(e) => setLanguagesInput(e.target.value)}
                      className="glass-input"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Media & Location */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                  <Compass className="h-5 w-5 text-[#DFFE00] stroke-[2px]" />
                  <h3 className="font-syne font-extrabold text-base uppercase tracking-wider text-white">Step 3: Verification & Media</h3>
                </div>

                {/* Profile Picture */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="relative group shrink-0">
                    <img 
                      src={user?.profile?.profile_pic || "https://api.dicebear.com/7.x/adventurer/svg?seed=Default"} 
                      alt="Avatar Preview" 
                      className="h-28 w-28 rounded-2xl bg-slate-900 border border-white/10 object-cover shadow-md"
                    />
                    {photoLoading && (
                      <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center text-white text-xs font-bold">
                        Loading...
                      </div>
                    )}
                  </div>
                  
                  <div className="text-center sm:text-left space-y-3">
                    <h4 className="font-extrabold text-sm md:text-base">Upload Profile Picture</h4>
                    <p className="text-slate-400 text-xs font-semibold max-w-xs leading-relaxed">
                      Choose a clear photograph of yourself to help others identify you when meeting in person.
                    </p>
                    
                    <label className="btn-secondary py-2.5 px-5 text-xs inline-flex items-center gap-2 cursor-pointer active:scale-95 transition-transform duration-200 uppercase font-bold">
                      <Camera className="h-4 w-4 text-[#DFFE00]" />
                      <span>{photoLoading ? 'Uploading...' : 'Choose File'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                        disabled={photoLoading}
                      />
                    </label>
                  </div>
                </div>

                {/* Geolocation Detection */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-white/5 border border-white/10 rounded-3xl">
                  <div className="h-16 w-16 rounded-2xl bg-slate-900 border border-white/10 text-[#DFFE00] flex items-center justify-center shrink-0 shadow-sm">
                    <MapPin className="h-8 w-8 stroke-[2px]" />
                  </div>

                  <div className="text-center sm:text-left space-y-3 flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-extrabold text-sm md:text-base">Local City & Geolocation</h4>
                        <p className="text-slate-400 text-xs font-semibold mt-0.5">
                          Share location coordinates to compute compatibility and distance between buddies.
                        </p>
                      </div>
                      
                      <button
                        type="button"
                        onClick={handleLocationDetection}
                        disabled={locationLoading}
                        className="btn-secondary py-2.5 px-5 text-xs flex items-center gap-2 shrink-0 justify-center uppercase font-bold"
                      >
                        {locationLoading ? (
                          <>
                            <div className="animate-spin h-3.5 w-3.5 border-2 border-[#DFFE00] border-t-transparent rounded-full" />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <Compass className="h-4 w-4 text-[#DFFE00]" />
                            <span>Detect Location</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="space-y-1 pt-2">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 pl-1">Primary City</label>
                      <input 
                        type="text" 
                        placeholder="e.g. San Francisco, California"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="glass-input"
                        required
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Form Action Controls */}
          <div className="flex justify-between items-center pt-6 border-t border-white/5">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="btn-secondary py-3 px-6 text-sm uppercase font-bold"
              >
                Back
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary py-3 px-6 text-sm flex items-center gap-2 uppercase tracking-wide"
              >
                <span>Continue</span>
                <Sparkles className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={saveLoading}
                className="btn-accent py-3.5 px-8 text-sm flex items-center gap-2 uppercase tracking-wider font-extrabold"
              >
                <span>{saveLoading ? 'Saving...' : 'Finish Setup'}</span>
                <CheckCircle className="h-4 w-4" />
              </button>
            )}
          </div>

        </form>

      </div>
    </div>
  );
};

export default ProfilePage;
