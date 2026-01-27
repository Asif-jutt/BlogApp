import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBlog } from '../context/BlogContext';
import { useAuth } from '../context/AuthContext';
import { useDevTo } from '../context/DevToContext';
import BlogCard from '../components/BlogCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const { blogs, loading, fetchBlogs, categories } = useBlog();
  const { isAuthenticated } = useAuth();
  const { articles, fetchLatestArticles, loading: devtoLoading } = useDevTo();

  useEffect(() => {
    fetchBlogs({ limit: 6 });
    fetchLatestArticles(6);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-linear-to-br from-indigo-600 via-purple-600 to-pink-500 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}></div>
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-24 md:py-32">
          <div className="text-center">
            <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
              ✨ Welcome to our blogging platform
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Share Your Stories<br />
              <span className="bg-linear-to-r from-yellow-200 to-pink-200 bg-clip-text text-transparent">
                Inspire the World
              </span>
            </h1>
            <p className="text-xl text-indigo-100 mb-10 max-w-2xl mx-auto">
              Discover amazing content from our community of writers. Create, share, and connect with like-minded readers and creators.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link 
                  to="/create"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Write a Blog
                </Link>
              ) : (
                <Link 
                  to="/register"
                  className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl"
                >
                  Start Writing Free
                </Link>
              )}
              <Link 
                to="/blogs"
                className="px-8 py-4 bg-white/10 text-white border border-white/30 rounded-xl font-semibold hover:bg-white/20 transition-all backdrop-blur-sm"
              >
                Explore Blogs
              </Link>
            </div>
          </div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 md:h-20 text-gray-50" preserveAspectRatio="none" viewBox="0 0 1440 74">
            <path fill="currentColor" d="M456.464 0.0433865C277.158 -1.70575 0 50.0141 0 50.0141V74H1440V50.0141C1440 50.0141 1320.4 31.1925 1243.09 27.0276C1099.33 19.2816 1019.08 53.1981 googl864.567 53.1981C710.059 53.1981 709.471 17.0311 googl55.537 2.09753C601.602 -12.8367 635.771 1.79165 456.464 0.0433865Z"></path>
          </svg>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white border-b">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {['Technology', 'Lifestyle', 'Travel', 'Food', 'Health', 'Business', 'Entertainment', 'Sports'].map((cat) => (
              <Link
                key={cat}
                to={`/blogs?category=${cat}`}
                className="px-5 py-2.5 bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 rounded-full text-gray-600 font-medium transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Latest Blogs</h2>
            <p className="text-gray-500 mt-2">Fresh content from our community</p>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-16 px-4 max-w-md mx-auto">
              <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Blogs Yet</h3>
              <p className="text-gray-500 mb-8 leading-relaxed">Be the first to share your story with the world! Start writing and inspire others.</p>
              {isAuthenticated ? (
                <Link
                  to="/create"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Write First Blog
                </Link>
              ) : (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                >
                  Get Started
                </Link>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
                {blogs.map((blog) => (
                  <div key={blog._id} className="w-full max-w-sm">
                    <BlogCard blog={blog} />
                  </div>
                ))}
              </div>
              <div className="text-center mt-12">
                <Link 
                  to="/blogs"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-linear-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                >
                  View All Blogs
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose BlogApp?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Everything you need to create, share, and grow your blog
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-linear-to-br from-indigo-50 to-purple-50 text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Easy Writing</h3>
              <p className="text-gray-500">Simple and intuitive editor to write and publish your blogs in minutes</p>
            </div>
            <div className="p-8 rounded-2xl bg-linear-to-br from-purple-50 to-pink-50 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Engaged Community</h3>
              <p className="text-gray-500">Connect with readers through likes, comments, and meaningful discussions</p>
            </div>
            <div className="p-8 rounded-2xl bg-linear-to-br from-pink-50 to-orange-50 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Grow Your Reach</h3>
              <p className="text-gray-500">Categorize your content and reach readers interested in your topics</p>
            </div>
          </div>
        </div>
      </section>

      {/* DEV.to Articles Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="px-3 py-1 bg-black text-white text-sm font-bold rounded">DEV</span>
              <h2 className="text-3xl font-bold text-gray-900">From DEV Community</h2>
            </div>
            <p className="text-gray-500 mt-2">Discover trending articles from developers worldwide</p>
          </div>

          {devtoLoading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="lg" />
            </div>
          ) : articles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>Unable to load DEV.to articles at the moment</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center">
                {articles.slice(0, 6).map((article) => (
                  <Link
                    key={article.id}
                    to={`/devto/${article.id}`}
                    className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100 w-full max-w-sm"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 bg-linear-to-br from-indigo-100 to-purple-100 overflow-hidden">
                      {article.cover_image || article.social_image ? (
                        <img
                          src={article.cover_image || article.social_image}
                          alt={article.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-indigo-500 to-purple-600">
                          <svg className="w-16 h-16 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                          </svg>
                        </div>
                      )}
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      {/* DEV Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1.5 bg-black text-white text-xs font-bold rounded-lg shadow-lg">DEV</span>
                      </div>
                      {/* Reactions Badge */}
                      <div className="absolute top-4 right-4">
                        <span className="px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-lg shadow-lg flex items-center gap-1">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                          {article.public_reactions_count || 0}
                        </span>
                      </div>
                    </div>
                    
                    {/* Content Section */}
                    <div className="p-6 flex flex-col flex-1">
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {article.tag_list?.slice(0, 3).map((tag) => (
                          <span key={tag} className="px-2.5 py-1 bg-indigo-50 text-indigo-600 rounded-full text-xs font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                      
                      {/* Title */}
                      <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
                        {article.title}
                      </h3>
                      
                      {/* Author Section */}
                      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-100">
                        <img
                          src={article.user?.profile_image}
                          alt={article.user?.name}
                          className="w-10 h-10 rounded-full ring-2 ring-indigo-100"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{article.user?.name}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(article.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              {/* Explore More Button */}
              <div className="text-center mt-12">
                <Link 
                  to="/explore"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl"
                >
                  Explore More Articles
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-linear-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-indigo-100 mb-10 text-lg max-w-2xl mx-auto">
            Join thousands of writers and readers. Create your free account today and start sharing your stories with the world.
          </p>
          {!isAuthenticated && (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/register"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-indigo-50 transition-all shadow-lg"
              >
                Create Free Account
              </Link>
              <Link 
                to="/login"
                className="px-8 py-4 bg-transparent text-white border-2 border-white/50 rounded-xl font-semibold hover:bg-white/10 transition-all"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
