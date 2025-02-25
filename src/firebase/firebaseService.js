import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './config';

// Collection names
const JOBS_COLLECTION = 'jobs';

// Add a new job
export const addJobDocument = async (userId, jobData) => {
  try {
    const jobWithMetadata = {
      ...jobData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobWithMetadata);
    return { id: docRef.id, ...jobWithMetadata };
  } catch (error) {
    console.error("Error adding job: ", error);
    throw error;
  }
};

// Update a job
export const updateJobDocument = async (jobId, updatedData) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    
    // Add updatedAt timestamp
    const dataWithTimestamp = {
      ...updatedData,
      updatedAt: serverTimestamp()
    };
    
    await updateDoc(jobRef, dataWithTimestamp);
    return { id: jobId, ...updatedData };
  } catch (error) {
    console.error("Error updating job: ", error);
    throw error;
  }
};

// Delete a job
export const deleteJobDocument = async (jobId) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    await deleteDoc(jobRef);
    return jobId;
  } catch (error) {
    console.error("Error deleting job: ", error);
    throw error;
  }
};

// Get a job by ID
export const getJobById = async (jobId) => {
  try {
    const jobRef = doc(db, JOBS_COLLECTION, jobId);
    const jobSnap = await getDoc(jobRef);
    
    if (jobSnap.exists()) {
      return { id: jobSnap.id, ...jobSnap.data() };
    } else {
      throw new Error("Job not found");
    }
  } catch (error) {
    console.error("Error getting job: ", error);
    throw error;
  }
};

// Get all jobs for a user
export const getUserJobs = async (userId, sortBy = 'updatedAt', sortDirection = 'desc') => {
  try {
    // First try to get jobs with sorting (which requires an index)
    try {
      const jobsQuery = query(
        collection(db, JOBS_COLLECTION),
        where("userId", "==", userId),
        orderBy(sortBy, sortDirection)
      );
      
      const querySnapshot = await getDocs(jobsQuery);
      const jobs = [];
      
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      
      return jobs;
    } catch (indexError) {
      // If index error occurs, fallback to getting jobs without sorting
      console.warn("Index error, falling back to non-sorted query:", indexError);
      
      const jobsQuery = query(
        collection(db, JOBS_COLLECTION),
        where("userId", "==", userId)
      );
      
      const querySnapshot = await getDocs(jobsQuery);
      const jobs = [];
      
      querySnapshot.forEach((doc) => {
        jobs.push({ id: doc.id, ...doc.data() });
      });
      
      // Sort the jobs in memory instead
      return jobs.sort((a, b) => {
        if (!a[sortBy] || !b[sortBy]) return 0;
        
        if (sortDirection === 'desc') {
          return a[sortBy] > b[sortBy] ? -1 : 1;
        } else {
          return a[sortBy] < b[sortBy] ? -1 : 1;
        }
      });
    }
  } catch (error) {
    console.error("Error getting user jobs: ", error);
    throw error;
  }
};

// Get jobs by status
export const getJobsByStatus = async (userId, status) => {
  try {
    const jobsQuery = query(
      collection(db, JOBS_COLLECTION),
      where("userId", "==", userId),
      where("status", "==", status)
    );
    
    const querySnapshot = await getDocs(jobsQuery);
    const jobs = [];
    
    querySnapshot.forEach((doc) => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    return jobs;
  } catch (error) {
    console.error("Error getting jobs by status: ", error);
    throw error;
  }
};

// Create a sample job for testing
export const createSampleJob = async (userId) => {
  try {
    const indianJobs = [
      {
        company: "Tata Consultancy Services",
        position: "Software Engineer",
        location: "Bangalore, India",
        status: "applied",
        salary: "₹8,00,000 - ₹12,00,000",
        jobUrl: "https://www.tcs.com/careers",
        description: "Developing and maintaining enterprise software applications for clients across various domains.",
        notes: "Applied through employee referral. Need to follow up next week."
      },
      {
        company: "Infosys",
        position: "Full Stack Developer",
        location: "Hyderabad, India",
        status: "interviewing",
        salary: "₹7,50,000 - ₹11,00,000",
        jobUrl: "https://www.infosys.com/careers",
        description: "Building web applications using React, Node.js, and MongoDB.",
        notes: "First round of interview completed. Technical assessment scheduled for next week."
      },
      {
        company: "Wipro",
        position: "DevOps Engineer",
        location: "Pune, India",
        status: "applied",
        salary: "₹9,00,000 - ₹14,00,000",
        jobUrl: "https://www.wipro.com/careers",
        description: "Managing CI/CD pipelines and cloud infrastructure using AWS and Azure.",
        notes: "Applied through LinkedIn. Waiting for response."
      },
      {
        company: "HCL Technologies",
        position: "Data Scientist",
        location: "Noida, India",
        status: "offered",
        salary: "₹12,00,000 - ₹18,00,000",
        jobUrl: "https://www.hcltech.com/careers",
        description: "Analyzing large datasets and building machine learning models for business insights.",
        notes: "Received offer letter. Need to negotiate salary."
      },
      {
        company: "Tech Mahindra",
        position: "UI/UX Designer",
        location: "Mumbai, India",
        status: "rejected",
        salary: "₹6,00,000 - ₹9,00,000",
        jobUrl: "https://www.techmahindra.com/careers",
        description: "Designing user interfaces and experiences for mobile and web applications.",
        notes: "Rejected after final round. Feedback: Need more experience with design systems."
      },
      {
        company: "Cognizant",
        position: "Java Developer",
        location: "Chennai, India",
        status: "applied",
        salary: "₹7,00,000 - ₹10,00,000",
        jobUrl: "https://www.cognizant.com/careers",
        description: "Developing and maintaining Java-based applications for banking clients.",
        notes: "Applied through company website. Waiting for response."
      },
      {
        company: "Accenture India",
        position: "Cloud Architect",
        location: "Bangalore, India",
        status: "interviewing",
        salary: "₹15,00,000 - ₹22,00,000",
        jobUrl: "https://www.accenture.com/in-en/careers",
        description: "Designing and implementing cloud solutions using AWS, Azure, and GCP.",
        notes: "Second round of interview completed. Final round scheduled next week."
      },
      {
        company: "Reliance Jio",
        position: "Network Engineer",
        location: "Mumbai, India",
        status: "applied",
        salary: "₹8,50,000 - ₹13,00,000",
        jobUrl: "https://careers.jio.com",
        description: "Managing and optimizing telecom network infrastructure.",
        notes: "Applied through referral. Initial screening call completed."
      },
      {
        company: "Flipkart",
        position: "Product Manager",
        location: "Bangalore, India",
        status: "interviewing",
        salary: "₹18,00,000 - ₹25,00,000",
        jobUrl: "https://www.flipkartcareers.com",
        description: "Managing e-commerce product development and feature roadmap.",
        notes: "Completed first two rounds. Product case study presentation scheduled."
      },
      {
        company: "Zomato",
        position: "Mobile App Developer",
        location: "Gurgaon, India",
        status: "accepted",
        salary: "₹14,00,000 - ₹20,00,000",
        jobUrl: "https://www.zomato.com/careers",
        description: "Developing and maintaining food delivery mobile applications for Android and iOS.",
        notes: "Accepted offer. Starting next month."
      }
    ];
    
    const createdJobs = [];
    
    // Create multiple jobs with different dates
    for (let i = 0; i < indianJobs.length; i++) {
      const job = indianJobs[i];
      const daysAgo = i * 3; // Each job applied a different number of days ago
      const dateApplied = new Date();
      dateApplied.setDate(dateApplied.getDate() - daysAgo);
      
      const jobData = {
        userId,
        ...job,
        dateApplied: dateApplied.toISOString(),
        interviewDate: job.status === 'interviewing' ? new Date(dateApplied.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString() : null,
        isReferral: job.notes.includes('referral'),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, JOBS_COLLECTION), jobData);
      createdJobs.push({ id: docRef.id, ...jobData });
    }
    
    console.log(`Created ${createdJobs.length} sample Indian jobs`);
    return createdJobs;
  } catch (error) {
    console.error("Error creating sample jobs: ", error);
    throw error;
  }
};
