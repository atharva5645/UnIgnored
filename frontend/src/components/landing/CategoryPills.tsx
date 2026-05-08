import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CATEGORY_META } from '../../utils/mockData'
import { clsx } from 'clsx'

export function CategoryPills() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">What's on your mind?</h2>
          <p className="text-slate-400">Select a category to quickly file a report</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {Object.entries(CATEGORY_META).map(([key, meta], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <Link 
                to={`/complaints/new?category=${key}`}
                className="group flex flex-col items-center justify-center p-6 glass rounded-3xl border border-white/5 hover:border-primary-500/50 hover:bg-primary-500/5 transition-all duration-300"
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {meta.icon}
                </div>
                <span className="text-xs font-bold text-slate-400 group-hover:text-white uppercase tracking-widest text-center">
                  {meta.label}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
