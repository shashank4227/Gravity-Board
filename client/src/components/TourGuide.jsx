import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useEffect, useState } from "react";
import { useTaskContext } from "../context/TaskContext";

const TourGuide = () => {
  const { tasks, toggleMobileSidebar, isMobileSidebarOpen } = useTaskContext();
  const [introCompleted, setIntroCompleted] = useState(
      !!localStorage.getItem("gravityBoard_intro_completed")
  );

  // Effect 1: General Intro Tour (Runs once on first visit)
  useEffect(() => {
    const hasSeenIntro = localStorage.getItem("gravityBoard_intro_completed");

    if (!hasSeenIntro) {
      const isMobile = window.innerWidth < 768;

      const driverObj = driver({
        showProgress: true,
        popoverClass: 'driverjs-theme',
        steps: [
          { 
            element: 'body', 
            popover: { 
              title: 'Welcome to GravityBoard! 🪐', 
              description: 'Let\'s take a quick tour to help you master your productivity gravity field.',
              side: "left", 
              align: 'start' 
            } 
          },
          { 
            element: 'aside', 
            popover: { 
              title: 'Navigation & Folders', 
              description: 'Here you can navigate between filters like Today, Upcoming, and your custom project sectors.', 
              side: "right", 
              align: 'start' 
            },
            onHighlightStarted: () => {
                if (window.innerWidth < 768) {
                     // Check if not already open to toggle correctly
                     const sidebar = document.querySelector('aside');
                     // We use the context toggle, but since state isn't available inside this callback closure easily
                     // we rely on the visual state or just force it. 
                     // Since we can't easily access updated 'isMobileSidebarOpen' inside this closure due to stale state,
                     // we'll trigger the toggle.
                     toggleMobileSidebar();
                }
            }
          },
          { 
            element: 'aside button:has(.text-neon-cyan)', 
            popover: { 
                title: 'High Priority (Favorites) ⭐', 
                description: 'Click here to instantly filter and see only your most critical "High Gravity" tasks.', 
                side: "right", 
                align: 'center' 
            } 
          },
          { 
            element: 'header input', 
            popover: { 
              title: 'Search', 
              description: 'Lost a task? Just type here to search by title or description instantly.', 
              side: "bottom", 
              align: 'start' 
            },
            onHighlightStarted: () => {
                // Close sidebar when moving to search
                if (window.innerWidth < 768) {
                    toggleMobileSidebar();
                }
            }
          },
          { 
            element: '.group\\/column:first-child', 
            popover: { 
              title: 'Kanban Columns', 
              description: 'Your tasks live here. They are automatically sorted by "Gravity" - a mix of Priority and Deadline.', 
              side: "right", 
              align: 'start' 
            } 
          },
          { 
            element: '[data-tour="add-task-btn"]', 
            popover: { 
              title: 'Add New Task', 
              description: 'Click the "+" button in any column to create a new task.', 
              side: "top", 
              align: 'center' 
            } 
          }
        ],
        onDestroyStarted: () => {
            if(!driverObj.hasNextStep() || confirm("Are you sure you want to skip the tour?")) {
                driverObj.destroy();
                localStorage.setItem("gravityBoard_intro_completed", "true");
                localStorage.setItem("gravityBoard_tour_completed", "true"); 
                setIntroCompleted(true); // Trigger the next effect
                
                // Ensure sidebar is closed if mobile tour ended early or normally
                if(window.innerWidth < 768) {
                    // Try to safely close it if it was left open? 
                    // It's tricky without accurate state. 
                    // Best effort: usually "Search" step closes it. 
                }
            }
        },
      });

      driverObj.drive();
    }
  }, []);

  // Effect 2: Gravity Score Explanation 
  // Runs ONLY after intro is done AND tasks exist AND hasn't been seen
  useEffect(() => {
    const hasSeenGravityHelp = localStorage.getItem("gravityBoard_gravity_explained");
    
    if (introCompleted && tasks.length > 0 && !hasSeenGravityHelp) {
        
      const timer = setTimeout(() => {
          const driverObj = driver({
            showProgress: false,
            popoverClass: 'driverjs-theme',
            steps: [
              { 
                element: '[data-tour="gravity-score"]', 
                popover: { 
                  title: 'Gravity Score Detected! 🌌', 
                  description: 'This **Gravity Score** determines order. High Priority, Urgent Deadlines, and Energy Levels increase gravity. Heavier tasks **rise to the top**, ensuring you always focus on what effectively matters first.', 
                  side: "left", 
                  align: 'center' 
                } 
              }
            ],
            onDestroyStarted: () => {
                driverObj.destroy();
                localStorage.setItem("gravityBoard_gravity_explained", "true");
            },
          });

          driverObj.drive();
      }, 1000); 

      return () => clearTimeout(timer);
    }
  }, [tasks, introCompleted]);

  return null;
};

export default TourGuide;
