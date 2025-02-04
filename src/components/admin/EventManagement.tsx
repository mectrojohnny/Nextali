'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { doc, setDoc, collection, getDocs, deleteDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import ImageGallery from './ImageGallery';

// Debug utility with timestamp and render count
const DEBUG = {
  renderCount: 0,
  log: (message: string, data?: unknown) => {
    const timestamp = new Date().toISOString().split('T')[1];
    const style = 'color: #803C9A; font-weight: bold; font-size: 14px; padding: 2px;';
    const prefix = `[Events ${timestamp}]`;
    
    if (data) {
      console.groupCollapsed(`%c${prefix} ${message}`, style);
      console.log('Data:', data);
      console.trace('Call stack');
      console.groupEnd();
    } else {
      console.log(`%c${prefix} ${message}`, style);
    }
  },
  error: (message: string, error?: Error | unknown) => {
    const timestamp = new Date().toISOString().split('T')[1];
    const style = 'color: #FF0000; font-weight: bold; font-size: 14px; background: #FFE6E6; padding: 2px;';
    const prefix = `[Error ${timestamp}]`;
    
    console.group(`%c${prefix} ${message}`, style);
    if (error) {
      console.error('Error details:', error);
      console.trace('Error stack');
    }
    console.groupEnd();
  },
  warn: (message: string, data?: unknown) => {
    const timestamp = new Date().toISOString().split('T')[1];
    const style = 'color: #FFA500; font-weight: bold; font-size: 14px; background: #FFF3E6; padding: 2px;';
    const prefix = `[Warning ${timestamp}]`;
    
    console.groupCollapsed(`%c${prefix} ${message}`, style);
    if (data) console.warn('Data:', data);
    console.trace('Warning stack');
    console.groupEnd();
  }
};

// Force debug message on component load
if (typeof window !== 'undefined') {
  console.clear();
  DEBUG.log('EventManagement module initialized');
}

interface TodayEvent {
  id: string;
  title: string;
  time: string;
  type: 'event' | 'live' | 'new';
  description: string;
  mediaUrl: string;
  link: string;
  date?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
  test?: boolean;
  author: {
    id: string;
    email: string;
    name: string;
  };
}

// Update placeholder image path
const PLACEHOLDER_IMAGE = '/images/placeholder.svg';

// Add admin emails constant
const ADMIN_EMAILS = ['akalagborojohn@gmail.com', 'nextalihq@gmail.com', 'Mercytaye30@gmail.com', 'estherene63@gmail.com'];

export default function EventManagement() {
  DEBUG.renderCount++;
  DEBUG.log(`Component rendering (${DEBUG.renderCount})`);
  
  // Add user state
  const [currentUser, setCurrentUser] = useState({
    uid: auth.currentUser?.uid || '',
    email: auth.currentUser?.email || '',
    displayName: auth.currentUser?.displayName || 'Admin User'
  });

  const [event, setEvent] = useState<TodayEvent>({
    id: 'current_event',
    title: '',
    time: '',
    type: 'event',
    description: '',
    mediaUrl: '',
    link: '',
    date: new Date(),
    author: {
      id: currentUser.uid,
      email: currentUser.email,
      name: currentUser.displayName
    }
  });
  const [allEvents, setAllEvents] = useState<TodayEvent[]>([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showGallery, setShowGallery] = useState(false);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const logAuth = () => {
      const user = auth.currentUser;
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Admin User'
        });
        DEBUG.log('User details updated', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName
        });
      }
    };

    // Log initial auth state
    logAuth();

    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser({
          uid: user.uid,
          email: user.email || '',
          displayName: user.displayName || 'Admin User'
        });
      }
      DEBUG.log('Auth state changed', {
        isAuthenticated: !!user,
        user: {
          email: user?.email,
          uid: user?.uid,
          displayName: user?.displayName
        }
      });
    });

    // Initial data fetch
    fetchEvents();

    return () => {
      DEBUG.log('Component cleanup');
      unsubscribe();
    };
  }, []);

  // Initialize events collection and check admin status
  useEffect(() => {
    const initializeEvents = async () => {
      try {
        // Check if user is admin
        if (!currentUser.uid || !currentUser.email) {
          DEBUG.error('No authenticated user');
          return;
        }

        // Check if user's email is in admin list
        if (!ADMIN_EMAILS.includes(currentUser.email.toLowerCase())) {
          DEBUG.error('User is not an admin');
          return;
        }

        DEBUG.log('Admin status verified', { userId: currentUser.uid, email: currentUser.email });

        // Check events collection
        const eventsRef = collection(db, 'events');
        const eventsQuery = query(eventsRef, orderBy('updatedAt', 'desc'));
        const eventsSnapshot = await getDocs(eventsQuery);

        DEBUG.log('Events collection status', {
          exists: !eventsSnapshot.empty,
          count: eventsSnapshot.size
        });

        // If no events exist, create a welcome event
        if (eventsSnapshot.empty) {
          const welcomeEvent = {
            id: 'welcome_event',
            title: 'Welcome to Events',
            time: 'Anytime',
            type: 'event' as const,
            description: 'This is your first event. You can edit or delete this event.',
            mediaUrl: PLACEHOLDER_IMAGE,
            link: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            createdBy: currentUser.uid,
            updatedBy: currentUser.uid,
            author: {
              id: currentUser.uid,
              email: currentUser.email,
              name: currentUser.displayName
            }
          };

          await setDoc(doc(db, 'events', welcomeEvent.id), welcomeEvent);
          DEBUG.log('Welcome event created');
        }

        // Fetch events
        await fetchEvents();
      } catch (error) {
        DEBUG.error('Failed to initialize events', error);
      }
    };

    // Only run initialization if we have a user
    if (currentUser.uid && currentUser.email) {
      initializeEvents();
    }
  }, [currentUser]);

  const fetchEvents = async () => {
    DEBUG.log('Starting events fetch');
    try {
      const eventsRef = collection(db, 'events');
      const eventsQuery = query(eventsRef, orderBy('updatedAt', 'desc'));
      
      DEBUG.log('Events query created', { path: eventsRef.path });
      
      const eventsSnapshot = await getDocs(eventsQuery);
      DEBUG.log('Events snapshot received', { 
        count: eventsSnapshot.size,
        empty: eventsSnapshot.empty
      });
      
      const eventsData = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : undefined
        };
      }) as TodayEvent[];
      
      setAllEvents(eventsData);
      DEBUG.log('Events data processed', { 
        count: eventsData.length,
        events: eventsData.map(e => ({ id: e.id, title: e.title }))
      });
    } catch (error) {
      DEBUG.error('Events fetch failed', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
    } finally {
      setEventsLoading(false);
      DEBUG.log('Events fetch completed');
    }
  };

  // Check authentication and admin status
  const checkAdminStatus = async () => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        throw new Error('Authentication required. Please log in again.');
      }

      const userEmail = user.email.toLowerCase();
      if (!ADMIN_EMAILS.includes(userEmail)) {
        throw new Error('Admin access required to save events.');
      }

      DEBUG.log('Admin status verified for event operation', { 
        email: userEmail,
        uid: user.uid 
      });

      return true;
    } catch (error) {
      DEBUG.error('Admin check failed', error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    DEBUG.log('Starting event submission');
    
    try {
      await checkAdminStatus();
      setSaving(true);
      setStatus('idle');

      const now = new Date();
      const isNewEvent = event.id.startsWith('event_');
      
      // Validate required fields with specific messages
      const requiredFields = {
        title: event.title.trim(),
        time: event.time.trim(),
        type: event.type,
        description: event.description.trim()
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([, value]) => !value)
        .map(([field]) => field);

      if (missingFields.length > 0) {
        const errorMessage = `Required fields missing: ${missingFields.join(', ')}`;
        throw new Error(errorMessage);
      }

      // Validate image URL
      if (event.mediaUrl && !event.mediaUrl.startsWith('http')) {
        throw new Error('Invalid image URL. Must start with http:// or https://');
      }

      // Prepare event data with validation
      const eventData = {
        title: requiredFields.title,
        time: requiredFields.time,
        type: event.type,
        description: requiredFields.description,
        mediaUrl: event.mediaUrl || PLACEHOLDER_IMAGE,
        link: event.link.trim(),
        date: event.date || now,
        updatedAt: now.toISOString(),
        updatedBy: currentUser.uid,
        author: {
          id: currentUser.uid,
          email: currentUser.email,
          name: currentUser.displayName
        },
        ...(isNewEvent && {
          createdAt: now.toISOString(),
          createdBy: currentUser.uid
        })
      };

      DEBUG.log('Attempting to save event data', {
        eventId: event.id,
        isNewEvent,
        data: eventData
      });

      // Create document reference
      const eventRef = doc(db, 'events', event.id);
      
      // Save with merge option
      await setDoc(eventRef, eventData, { merge: true });
      
      // Verify the save
      const savedEvent = await getDoc(eventRef);
      if (!savedEvent.exists()) {
        throw new Error('Event failed to save. Please try again.');
      }

      const savedData = savedEvent.data();
      DEBUG.log('Event saved successfully', {
        eventId: event.id,
        savedData
      });

      // Verify saved data matches what we tried to save
      const mismatches = Object.entries(eventData).filter(([key, value]) => 
        JSON.stringify(savedData[key]) !== JSON.stringify(value)
      );

      if (mismatches.length > 0) {
        DEBUG.warn('Saved data differs from submitted data', { mismatches });
      }
      
      setStatus('success');
      await fetchEvents();
      
      setTimeout(() => {
        setStatus('idle');
        setShowForm(false);
        setEditingEvent(null);
      }, 2000);
    } catch (error) {
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred while saving the event.';

      DEBUG.error('Failed to save event', {
        error,
        message: errorMessage,
        stack: error instanceof Error ? error.stack : undefined,
        eventData: event,
        auth: {
          currentUser: currentUser.uid,
          email: currentUser.email,
          isAuthenticated: !!currentUser.uid
        }
      });

      setStatus('error');
      alert(`Error saving event: ${errorMessage}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (eventToEdit: TodayEvent) => {
    DEBUG.log('Editing event', eventToEdit);
    setEvent(eventToEdit);
    setEditingEvent(eventToEdit.id);
    setShowForm(true);
  };

  const handleDelete = async (eventId: string) => {
    DEBUG.log('Delete requested for event', eventId);
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        DEBUG.log('Deleting event');
        await deleteDoc(doc(db, 'events', eventId));
        DEBUG.log('Event deleted successfully');
        await fetchEvents();
      } catch (error) {
        DEBUG.error('Failed to delete event', {
          error,
          eventId,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      }
    } else {
      DEBUG.warn('Event deletion cancelled by user');
    }
  };

  const handleAddNew = () => {
    const newEventId = `event_${Date.now()}`;
    DEBUG.log('Creating new event', { newEventId });
    setEvent({
      id: newEventId,
      title: '',
      time: '',
      type: 'event',
      description: '',
      mediaUrl: '',
      link: '',
      date: new Date(),
      author: {
        id: '',
        email: '',
        name: ''
      }
    });
    setEditingEvent(null);
    setShowForm(true);
  };

  const createTestEvent = async () => {
    DEBUG.log('Creating test event');
    
    if (!auth.currentUser) {
      DEBUG.error('No authenticated user found');
      return;
    }

    // Get current user
    const userId = auth.currentUser.uid;
    const userEmail = auth.currentUser.email;

    DEBUG.log('Current user details', { userId, userEmail });

    // Create test event data
    const now = new Date();
    const testEventData: TodayEvent = {
      id: `test_event_${Date.now()}`,
      title: 'Test Event',
      time: '2:00 PM',
      type: 'event',
      description: 'This is a test event for debugging purposes. Click save to create the event.',
      mediaUrl: 'https://res.cloudinary.com/dg0wv6niu/image/upload/v1738602856/e_t8noc2.jpg',
      link: 'https://example.com',
      createdAt: now,
      updatedAt: now,
      createdBy: userId,
      updatedBy: userId,
      test: true,
      author: {
        id: userId,
        email: userEmail || 'unknown',
        name: auth.currentUser.displayName || 'Admin User'
      }
    };

    DEBUG.log('Setting test event data', testEventData);

    // Set the event data and show the form
    setEvent(testEventData);
    setEditingEvent(null);
    setShowForm(true);

    DEBUG.log('Form shown with test data');
  };

  // Status effect for debugging
  useEffect(() => {
    if (status === 'error') {
      DEBUG.error('Form status changed to error');
    } else if (status === 'success') {
      DEBUG.log('Form status changed to success');
    }
  }, [status]);

  // Event data debug
  useEffect(() => {
    DEBUG.log('Current event data updated', event);
  }, [event]);

  if (eventsLoading) {
    DEBUG.log('Events loading...');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between" data-editing={editingEvent !== null}>
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
            Event Management
          </h2>
          {currentUser.email && (
            <p className="text-sm text-gray-600">
              Logged in as: {currentUser.displayName} ({currentUser.email})
            </p>
          )}
        </div>
        <div className="flex gap-4">
          <button
            onClick={createTestEvent}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all"
          >
            Create Test Event
          </button>
          <button
            onClick={handleAddNew}
            className="px-4 py-2 bg-gradient-to-r from-[#803C9A] to-[#FA4B99] text-white rounded-lg hover:shadow-lg transition-all"
          >
            Add New Event
          </button>
        </div>
      </div>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={event.title}
                onChange={(e) => setEvent(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time
              </label>
              <input
                type="text"
                value={event.time}
                onChange={(e) => setEvent(prev => ({ ...prev, time: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                placeholder="e.g., 2:00 PM"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={event.date ? new Date(event.date).toISOString().split('T')[0] : ''}
                onChange={(e) => setEvent(prev => ({ 
                  ...prev, 
                  date: e.target.value ? new Date(e.target.value) : undefined 
                }))}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={event.type}
              onChange={(e) => setEvent(prev => ({ ...prev, type: e.target.value as TodayEvent['type'] }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
              required
            >
              <option value="live">Live Session</option>
              <option value="event">Event</option>
              <option value="new">New Resource</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={event.description}
              onChange={(e) => setEvent(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Media URL (Image or Video)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={event.mediaUrl}
                onChange={(e) => setEvent(prev => ({ ...prev, mediaUrl: e.target.value }))}
                className="flex-grow px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowGallery(true)}
                className="px-4 py-2 bg-[#803C9A] text-white rounded-lg hover:bg-[#6A2F80] transition-colors"
              >
                <span className="material-icons-outlined">photo_library</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Link
            </label>
            <input
              type="url"
              value={event.link}
              onChange={(e) => setEvent(prev => ({ ...prev, link: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#803C9A] focus:border-transparent"
              required
            />
          </div>

          {/* Preview */}
          <div className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#803C9A]/10 shadow-lg overflow-hidden">
            <div className="relative h-48">
              <Image
                src={event.mediaUrl || PLACEHOLDER_IMAGE}
                alt={event.title}
                fill
                className="object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = PLACEHOLDER_IMAGE;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
              <div className="absolute top-4 left-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm border border-[#803C9A]/10 shadow-sm">
                  <span className={`material-icons-outlined text-lg ${
                    event.type === 'live' ? 'text-red-500 animate-pulse' :
                    event.type === 'event' ? 'text-[#803C9A]' :
                    'text-[#FA4B99]'
                  }`}>
                    {event.type === 'live' ? 'live_tv' :
                     event.type === 'event' ? 'event' :
                     'fiber_new'}
                  </span>
                  <span className="text-sm font-medium text-gray-800">
                    Latest Event
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
                  {event.title || 'Event Title'}
                </h3>
                <span className="text-sm font-medium text-[#803C9A]">
                  {event.time || 'Time'}
                </span>
              </div>
              <p className="text-gray-600 mb-4">
                {event.description || 'Event description will appear here'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            {status === 'success' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-green-600"
              >
                Changes saved successfully!
              </motion.p>
            )}
            {status === 'error' && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-600"
              >
                Error saving changes. Please try again.
              </motion.p>
            )}
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingEvent(null);
              }}
              className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-6 py-2 rounded-lg text-white font-medium transition-all ${
                saving
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#803C9A] to-[#FA4B99] hover:shadow-lg hover:scale-[1.02]'
              }`}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-6">
          {allEvents.map((evt) => (
            <div key={evt.id} className="bg-white/90 backdrop-blur-sm rounded-xl border border-[#803C9A]/10 shadow-lg overflow-hidden">
              <div className="flex gap-6">
                <div className="relative w-48 h-32">
                  <Image
                    src={evt.mediaUrl || PLACEHOLDER_IMAGE}
                    alt={evt.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = PLACEHOLDER_IMAGE;
                    }}
                  />
                </div>
                <div className="flex-grow p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold bg-gradient-to-r from-[#803C9A] to-[#FA4B99] bg-clip-text text-transparent">
                      {evt.title}
                    </h3>
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => handleEdit(evt)}
                        className="text-[#803C9A] hover:text-[#FA4B99] transition-colors"
                      >
                        <span className="material-icons-outlined">edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(evt.id)}
                        className="text-red-600 hover:text-red-700 transition-colors"
                      >
                        <span className="material-icons-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">schedule</span>
                      {evt.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="material-icons-outlined text-sm">
                        {evt.type === 'live' ? 'live_tv' : evt.type === 'event' ? 'event' : 'fiber_new'}
                      </span>
                      {evt.type === 'live' ? 'Live Session' : evt.type === 'event' ? 'Event' : 'New Resource'}
                    </span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{evt.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showGallery && (
        <ImageGallery
          onSelect={(url) => {
            setEvent(prev => ({ ...prev, mediaUrl: url }));
            setShowGallery(false);
          }}
          onClose={() => setShowGallery(false)}
        />
      )}
    </div>
  );
} 