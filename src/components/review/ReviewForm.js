import React, { useState, useRef } from 'react';
import { Star, X, ImagePlus, Loader } from 'lucide-react';
import { reviewAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function ReviewForm({ productId, onSuccess }) {
  const [rating, setRating]   = useState(0);
  const [hover, setHover]     = useState(0);
  const [title, setTitle]     = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages]   = useState([]);   // File objects
  const [previews, setPreviews] = useState([]); // preview URLs
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();

  const LABELS = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  const handleImagePick = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    const validFiles = files.filter(f => {
      if (!f.type.startsWith('image/')) { toast.error(`${f.name} is not an image`); return false; }
      if (f.size > 5 * 1024 * 1024) { toast.error(`${f.name} exceeds 5MB`); return false; }
      return true;
    });
    setImages(prev => [...prev, ...validFiles]);
    validFiles.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setPreviews(prev => [...prev, e.target.result]);
      reader.readAsDataURL(f);
    });
    e.target.value = '';
  };

  const removeImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx));
    setPreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating)        return toast.error('Please select a rating');
    if (!comment.trim()) return toast.error('Please write your review');

    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('productId', productId);
      fd.append('rating', rating);
      if (title.trim()) fd.append('title', title.trim());
      fd.append('comment', comment.trim());
      images.forEach(img => fd.append('images', img));

      await reviewAPI.create(fd);
      toast.success('Review submitted! Thank you 🎉');
      setRating(0); setTitle(''); setComment('');
      setImages([]); setPreviews([]);
      onSuccess?.();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5 border-2 border-primary-100">
      <h3 className="font-bold text-gray-800 text-lg">Write Your Review</h3>

      {/* ─── Star Rating ─── */}
      <div>
        <p className="label mb-2">Your Rating *</p>
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map(s => (
            <button key={s} type="button"
                    onMouseEnter={() => setHover(s)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(s)}>
              <Star size={32}
                    className={`transition-colors cursor-pointer ${
                      s <= (hover || rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-200 fill-gray-200'
                    }`} />
            </button>
          ))}
          {(hover || rating) > 0 && (
            <span className="text-sm font-medium text-yellow-600 ml-1">
              {LABELS[hover || rating]}
            </span>
          )}
        </div>
      </div>

      {/* ─── Title ─── */}
      <div>
        <label className="label">Review Title (Optional)</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
               className="input" maxLength={200}
               placeholder="Summarize your experience in a few words" />
      </div>

      {/* ─── Comment ─── */}
      <div>
        <label className="label">Your Review *</label>
        <textarea value={comment} onChange={e => setComment(e.target.value)}
                  className="input resize-none" rows={4} maxLength={2000}
                  placeholder="Share details about your experience with this product..." />
        <p className="text-xs text-gray-400 mt-1 text-right">{comment.length}/2000</p>
      </div>

      {/* ─── Image Upload ─── */}
      <div>
        <label className="label">Add Photos (Optional, max 5)</label>

        {/* Previews */}
        {previews.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {previews.map((src, i) => (
              <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
                <img src={src} alt="" className="w-full h-full object-cover" />
                <button type="button" onClick={() => removeImage(i)}
                        className="absolute top-0.5 right-0.5 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center">
                  <X size={10} className="text-white" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload button */}
        {images.length < 5 && (
          <>
            <input ref={fileRef} type="file" accept="image/*" multiple
                   className="hidden" onChange={handleImagePick} />
            <button type="button" onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-xl text-sm text-gray-500 hover:border-primary-400 hover:text-primary-600 transition-colors">
              <ImagePlus size={18} />
              Add Photos ({images.length}/5)
            </button>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG — max 5MB each</p>
          </>
        )}
      </div>

      {/* ─── Submit ─── */}
      <button type="submit" disabled={loading || !rating || !comment.trim()}
              className="btn-primary w-full py-3 text-sm font-semibold disabled:opacity-50 gap-2">
        {loading
          ? <><Loader size={16} className="animate-spin" /> Submitting...</>
          : '⭐ Submit Review'
        }
      </button>
    </form>
  );
}