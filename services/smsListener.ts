import { parseSMS } from './smsParser';
import { categorizeTransaction } from './geminiService';
import { addTransaction } from './storageService';
import { Transaction } from '../types';

// Define the interface for the global window object to include the SMS plugin
declare global {
  interface Window {
    SMSReceive?: {
      startWatch: (
        success: () => void,
        error: (err: any) => void
      ) => void;
      stopWatch: (
        success: () => void,
        error: (err: any) => void
      ) => void;
    };
    Capacitor?: any;
  }
}

export const initSmsListener = (onNewTransaction: (tx: Transaction) => void) => {
  // 1. Check if we are running in a native environment (Capacitor/Cordova)
  const isNative = !!window.Capacitor?.isNativePlatform();

  if (!isNative) {
    console.log("Web environment detected: Background SMS listening disabled.");
    return;
  }

  // 2. Check if the plugin is available
  if (!window.SMSReceive) {
    console.warn("SMSReceive plugin not found. Make sure 'cordova-plugin-sms-receive' is installed.");
    return;
  }

  console.log("Initializing Native SMS Listener...");

  // 3. Start watching for SMS
  window.SMSReceive.startWatch(
    () => {
      console.log("SMS Watcher started successfully");
      
      // 4. Add the event listener for incoming SMS
      document.addEventListener('onSMSArrive', async (e: any) => {
        const sms = e.data;
        console.log("SMS Received:", sms);

        if (!sms || !sms.body) return;

        // 5. Parse the SMS
        const transaction = parseSMS(sms.body);

        if (transaction) {
          // 6. If it looks like a bank transaction, process it
          try {
            // Classify with AI
            const category = await categorizeTransaction(transaction);
            transaction.category = category;
            transaction.isAiClassified = true;

            // Save to DB
            const updatedList = addTransaction(transaction);
            
            // Notify UI
            onNewTransaction(transaction);
            
          } catch (err) {
            console.error("Error processing incoming SMS:", err);
          }
        }
      });
    },
    (err) => {
      console.error("Failed to start SMS watcher:", err);
    }
  );
};