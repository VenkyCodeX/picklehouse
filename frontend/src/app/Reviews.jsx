import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import api from '../lib/api';

function ReviewCard({ review, delay }) {
  return (
    <motion.div
      className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow border-l-4 border-brand-yellow"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -4 }}
    >
      <div className="flex items-center gap-1 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={16} className={i < review.rating ? 'fill-brand-yellow text-brand-yellow' : 'text-gray-300'} />
        ))}
      </div>
      <p className="font-playfair text-brand-black/80 text-sm leading-relaxed italic mb-4">"{review.comment}"</p>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center text-white font-bold text-lg">
          {review.name[0]}
        </div>
        <div>
          <p className="font-semibold text-brand-red text-sm">{review.name}</p>
          <p className="text-brand-black/40 text-xs">{review.location}</p>
        </div>
        {review.isGoogleReview && (
          <div className="ml-auto">
            <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold">Google Review</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reviews').then(r => { setReviews(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="bg-brand-yellow py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-block bg-brand-red text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest mb-4">Customer Love</span>
            <h1 className="font-playfair text-5xl md:text-6xl font-bold text-brand-black">What Our Customers Say</h1>
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex">{[...Array(5)].map((_, i) => <Star key={i} size={24} className="fill-brand-red text-brand-red" />)}</div>
              <span className="font-playfair text-2xl font-bold text-brand-black">5.0</span>
              <span className="text-brand-black/60">Based on 100+ Google Reviews</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 space-y-3 border-l-4 border-brand-yellow">
                <div className="skeleton h-4 w-24" />
                <div className="skeleton h-16 w-full" />
                <div className="flex gap-3">
                  <div className="skeleton w-10 h-10 rounded-full" />
                  <div className="space-y-1"><div className="skeleton h-4 w-24" /><div className="skeleton h-3 w-16" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((r, i) => <ReviewCard key={r._id} review={r} delay={i * 0.08} />)}
          </div>
        )}

        {/* CTA */}
        <motion.div
          className="mt-16 text-center bg-brand-black rounded-3xl p-10 border-4 border-brand-yellow"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-playfair text-3xl font-bold text-white mb-3">Love Our Pickles?</h2>
          <p className="text-white/70 mb-6 font-poppins">Share your experience and help others discover authentic Hyderabadi taste!</p>
          <a
            href="https://g.page/r/review"
            target="_blank"
            rel="noreferrer"
            className="btn-secondary text-lg px-8 py-4"
          >
            Write a Google Review ⭐
          </a>
        </motion.div>
      </div>
    </div>
  );
}
