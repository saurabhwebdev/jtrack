import { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { 
  getUserJobs, 
  addJobDocument, 
  updateJobDocument, 
  deleteJobDocument, 
  getJobsByStatus,
  createSampleJob
} from '../firebase/firebaseService';
import { useAuth } from './AuthContext';

const JobContext = createContext();

export const useJobContext = () => useContext(JobContext);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();

  // Fetch jobs when user changes
  useEffect(() => {
    const fetchJobs = async () => {
      if (!currentUser) {
        setJobs([]);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const userJobs = await getUserJobs(currentUser.uid);
        console.log("Retrieved jobs from Firestore:", userJobs);
        setJobs(userJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs:", err);
        setError("Failed to load jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [currentUser]);

  const addJob = async (jobData) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await addJobDocument(currentUser.uid, jobData);
      // Refresh jobs after adding
      fetchJobs();
    } catch (err) {
      console.error("Error adding job: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateJob = async (id, updatedData) => {
    if (!currentUser) {
      throw new Error("You must be logged in to update a job");
    }
    
    setLoading(true);
    try {
      await updateJobDocument(id, updatedData);
      setJobs(prevJobs => 
        prevJobs.map(job => job.id === id ? { ...job, ...updatedData } : job)
      );
      setError(null);
    } catch (err) {
      console.error("Error updating job:", err);
      setError("Failed to update job. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteJob = async (id) => {
    if (!currentUser) {
      throw new Error("You must be logged in to delete a job");
    }
    
    setLoading(true);
    try {
      await deleteJobDocument(id);
      setJobs(prevJobs => prevJobs.filter(job => job.id !== id));
      setError(null);
    } catch (err) {
      console.error("Error deleting job:", err);
      setError("Failed to delete job. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addJobNote = async (jobId, note) => {
    if (!currentUser) {
      throw new Error("You must be logged in to add a note");
    }
    
    setLoading(true);
    try {
      // Get the current job
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error("Job not found");
      
      // Add the new note
      const notes = job.notes || [];
      const updatedNotes = [...notes, { 
        id: uuidv4(), 
        text: note, 
        date: new Date().toISOString() 
      }];
      
      // Update the job in Firebase
      await updateJobDocument(jobId, { notes: updatedNotes });
      
      // Update local state
      setJobs(prevJobs => prevJobs.map(j => 
        j.id === jobId ? { ...j, notes: updatedNotes } : j
      ));
      
      setError(null);
    } catch (err) {
      console.error("Error adding job note:", err);
      setError("Failed to add note. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addJobEvent = async (jobId, event) => {
    if (!currentUser) {
      throw new Error("You must be logged in to add an event");
    }
    
    setLoading(true);
    try {
      // Get the current job
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error("Job not found");
      
      // Add the new event
      const events = job.events || [];
      const updatedEvents = [...events, { 
        id: uuidv4(), 
        ...event, 
        date: new Date().toISOString() 
      }];
      
      // Update the job in Firebase
      await updateJobDocument(jobId, { events: updatedEvents });
      
      // Update local state
      setJobs(prevJobs => prevJobs.map(j => 
        j.id === jobId ? { ...j, events: updatedEvents } : j
      ));
      
      setError(null);
    } catch (err) {
      console.error("Error adding job event:", err);
      setError("Failed to add event. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createTestJob = async () => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      await createSampleJob(currentUser.uid);
      // Refresh jobs by calling the same function used in useEffect
      try {
        const userJobs = await getUserJobs(currentUser.uid);
        console.log("Retrieved jobs from Firestore after creating test job:", userJobs);
        setJobs(userJobs);
        setError(null);
      } catch (err) {
        console.error("Error fetching jobs after creating test job:", err);
        setError(err.message);
      }
    } catch (err) {
      console.error("Error creating test job: ", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <JobContext.Provider value={{ 
      jobs, 
      loading, 
      error, 
      addJob, 
      updateJob, 
      deleteJob,
      addJobNote,
      addJobEvent,
      createTestJob
    }}>
      {children}
    </JobContext.Provider>
  );
};
