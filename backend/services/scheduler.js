import cron from 'node-cron';
import Canteen from '../models/Canteen.js';

// Function to check and update canteen status based on operating hours
const checkAndUpdateCanteenStatus = async () => {
  try {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    // Get all canteens with operating hours enabled
    const canteens = await Canteen.find({ 'operatingHours.enabled': true });
    
    for (const canteen of canteens) {
      const { openTime, closeTime } = canteen.operatingHours;
      
      // Determine if canteen should be active based on current time
      let shouldBeActive = false;
      
      if (openTime < closeTime) {
        // Normal case: e.g., 09:00 to 17:00
        shouldBeActive = currentTime >= openTime && currentTime < closeTime;
      } else {
        // Overnight case: e.g., 22:00 to 02:00
        shouldBeActive = currentTime >= openTime || currentTime < closeTime;
      }
      
      const newStatus = shouldBeActive ? 'active' : 'inactive';
      
      // Update status if it has changed
      if (canteen.status !== newStatus) {
        canteen.status = newStatus;
        await canteen.save();
        console.log(`[Scheduler] Canteen ${canteen.canteenId} status changed to ${newStatus} at ${currentTime}`);
      }
    }
  } catch (error) {
    console.error('[Scheduler] Error updating canteen status:', error);
  }
};

// Initialize scheduler
export const initScheduler = () => {
  // Run every minute to check canteen operating hours
  cron.schedule('* * * * *', () => {
    checkAndUpdateCanteenStatus();
  });
  
  console.log('[Scheduler] Canteen status scheduler initialized - running every minute');
  
  // Run immediately on startup
  checkAndUpdateCanteenStatus();
};

export default { initScheduler };
