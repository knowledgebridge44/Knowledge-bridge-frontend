import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/Button';
import { Card, CardContent } from '@/components/Card';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-primary-50 to-white dark:from-dark-academic-bg dark:to-dark-academic-bg-secondary">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-academic-text dark:text-dark-academic-text">
              Welcome to <span className="text-primary-600 dark:text-primary-400">Knowledge Bridge</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-academic-text-secondary dark:text-dark-academic-text-secondary">
              Connect, Learn, and Grow Together
            </p>
            <p className="text-lg mb-10 text-academic-text-muted dark:text-dark-academic-text-muted max-w-2xl mx-auto">
              An academic platform where students and teachers collaborate to share knowledge, 
              answer questions, and build a thriving learning community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary" size="lg">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary-600 dark:text-primary-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Course Learning</h3>
                <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
                  Access comprehensive courses with lessons, materials, and structured learning paths.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Q&A Community</h3>
                <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
                  Ask questions, share knowledge, and get answers from peers and instructors.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="text-center">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Ratings & Badges</h3>
                <p className="text-academic-text-secondary dark:text-dark-academic-text-secondary">
                  Rate content, earn badges, and track your learning progress.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600 dark:bg-primary-700">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Learning?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students and teachers on Knowledge Bridge today.
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-academic-bg-secondary dark:bg-dark-academic-bg">
        <div className="container-custom text-center text-academic-text-muted dark:text-dark-academic-text-muted">
          <p>&copy; {new Date().getFullYear()} Knowledge Bridge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};


