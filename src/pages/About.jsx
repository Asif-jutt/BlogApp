import React from 'react';
import { Link } from 'react-router-dom';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">About BlogApp</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            We're on a mission to give everyone a voice and create meaningful connections through storytelling.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Story</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                BlogApp was founded with a simple idea: everyone has a story worth sharing. We built this platform to make it easy for anyone to express their thoughts, share their experiences, and connect with others who share their interests.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Today, we're proud to be home to a vibrant community of writers, thinkers, and creators from all walks of life.
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Our Values</h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Authenticity</h3>
                    <p className="text-gray-600 text-sm">We encourage genuine expression and original content.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Community</h3>
                    <p className="text-gray-600 text-sm">Building connections through shared stories and ideas.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center shrink-0 mt-1">
                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">Simplicity</h3>
                    <p className="text-gray-600 text-sm">Making blogging accessible and enjoyable for everyone.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">What You Can Do</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-linear-to-br from-indigo-50 to-purple-50 rounded-2xl">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Write & Publish</h3>
              <p className="text-gray-600 text-sm">Create beautiful blogs with our easy-to-use editor and publish them instantly.</p>
            </div>
            <div className="p-6 bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Like & Comment</h3>
              <p className="text-gray-600 text-sm">Engage with content you love and share your thoughts through comments.</p>
            </div>
            <div className="p-6 bg-linear-to-br from-pink-50 to-orange-50 rounded-2xl">
              <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Discover & Explore</h3>
              <p className="text-gray-600 text-sm">Find blogs by category, search for topics, and discover new writers.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Built with Modern Tech</h2>
          <p className="text-gray-600 max-w-xl mx-auto mb-8">
            This project is built using the MERN stack with modern tools for an optimal experience.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {['MongoDB', 'Express.js', 'React', 'Node.js', 'Tailwind CSS', 'Vite', 'JWT Auth'].map((tech) => (
              <span key={tech} className="px-4 py-2 bg-white border border-gray-200 rounded-full text-gray-700 font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 bg-linear-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Start Writing?</h2>
          <p className="text-indigo-100 mb-8">Join our community and share your stories today.</p>
          <Link
            to="/register"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
};

export default About;
