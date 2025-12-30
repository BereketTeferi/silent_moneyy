import { Transaction, TransactionType, Category, BankProfile } from '../types';

export const SUPPORTED_BANKS: BankProfile[] = [
  { id: 'cbe', name: 'Commercial Bank of Ethiopia', senderIds: ['CBE', 'CBETH', 'Commercial Bank'], currency: 'ETB' },
  { id: 'dashen', name: 'Dashen Bank', senderIds: ['Dashen', 'DASHEN'], currency: 'ETB' },
  { id: 'awash', name: 'Awash Bank', senderIds: ['Awash', 'AWASH'], currency: 'ETB' },
  { id: 'abyssinia', name: 'Bank of Abyssinia', senderIds: ['BoA', 'ABYSSINIA'], currency: 'ETB' },
  { id: 'nib', name: 'Nib International Bank', senderIds: ['NIB', 'NIBInternational'], currency: 'ETB' },
  { id: 'abay', name: 'Abay Bank', senderIds: ['ABAY', 'Abay'], currency: 'ETB' },
  { id: 'addis', name: 'Addis International Bank', senderIds: ['ADDIS', 'Addis'], currency: 'ETB' },
  { id: 'amhara', name: 'Amhara Bank', senderIds: ['AMHARA', 'Amhara'], currency: 'ETB' },
  { id: 'berhan', name: 'Berhan Bank', senderIds: ['BERHAN', 'Berhan'], currency: 'ETB' },
  { id: 'bunna', name: 'Bunna Bank', senderIds: ['BUNNA', 'Bunna'], currency: 'ETB' },
  { id: 'coop', name: 'Cooperative Bank of Oromia', senderIds: ['CBO', 'Coopbank', 'COOP'], currency: 'ETB' },
  { id: 'enat', name: 'Enat Bank', senderIds: ['ENAT', 'Enat'], currency: 'ETB' },
  { id: 'global', name: 'Global Bank Ethiopia', senderIds: ['GLOBAL', 'Global', 'DEGA'], currency: 'ETB' },
  { id: 'lion', name: 'Lion International Bank', senderIds: ['LION', 'Lion', 'ANBESA'], currency: 'ETB' },
  { id: 'oromia', name: 'Oromia International Bank', senderIds: ['OIB', 'Oromia'], currency: 'ETB' },
  { id: 'hibret', name: 'Hibret Bank', senderIds: ['HIBRET', 'Hibret', 'UNITED'], currency: 'ETB' },
  { id: 'wegagen', name: 'Wegagen Bank', senderIds: ['WEGAGEN', 'Wegagen'], currency: 'ETB' },
  { id: 'zemen', name: 'Zemen Bank', senderIds: ['ZEMEN', 'Zemen'], currency: 'ETB' },
  { id: 'dbe', name: 'Development Bank of Ethiopia', senderIds: ['DBE'], currency: 'ETB' },
  { id: 'zamzam', name: 'ZamZam Bank', senderIds: ['ZAMZAM', 'ZamZam'], currency: 'ETB' },
  { id: 'hijra', name: 'Hijra Bank', senderIds: ['HIJRA', 'Hijra'], currency: 'ETB' },
  { id: 'siinqee', name: 'Siinqee Bank', senderIds: ['SIINQEE', 'Siinqee'], currency: 'ETB' },
  { id: 'shabelle', name: 'Shabelle Bank', senderIds: ['SHABELLE', 'Shabelle'], currency: 'ETB' },
  { id: 'ahadu', name: 'Ahadu Bank', senderIds: ['AHADU', 'Ahadu'], currency: 'ETB' },
  { id: 'goh', name: 'Goh Betoch Bank', senderIds: ['GOH', 'Goh'], currency: 'ETB' },
  { id: 'tsedey', name: 'Tsedey Bank', senderIds: ['TSEDEY', 'Tsedey'], currency: 'ETB' },
  { id: 'gadaa', name: 'Gadaa Bank', senderIds: ['GADAA', 'Gadaa'], currency: 'ETB' },
  { id: 'rammis', name: 'Rammis Bank', senderIds: ['RAMMIS', 'Rammis'], currency: 'ETB' },
  { id: 'other', name: 'Other Bank', senderIds: [], currency: 'ETB' },
];

interface ParseResult {
  bankId: string;
  amount: number;
  type: TransactionType;
  date: Date;
  description: string;
}

// Helper to parse dates loosely usually found in SMS
const parseDate = (dateStr: string): Date => {
  // Try standard parsing first
  const date = new Date(dateStr);
  if (!isNaN(date.getTime())) return date;
  return new Date(); // Fallback to now
};

const parseCBE = (text: string): ParseResult | null => {
  const creditMatch = text.match(/Credited with ([A-Z]{3})? ?([\d,]+(\.\d{2})?)/i);
  const debitMatch = text.match(/Debited with ([A-Z]{3})? ?([\d,]+(\.\d{2})?)/i);
  
  if (!creditMatch && !debitMatch) return null;

  const isCredit = !!creditMatch;
  const match = isCredit ? creditMatch : debitMatch;
  const amountStr = match ? match[2].replace(/,/g, '') : '0';
  
  const reasonMatch = text.match(/Reason:? (.+)$/i) || text.match(/Ref:? (.+)$/i);
  const description = reasonMatch ? reasonMatch[1].trim() : 'Transaction';

  return {
    bankId: 'cbe',
    amount: parseFloat(amountStr),
    type: isCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
    date: new Date(),
    description,
  };
};

const parseDashen = (text: string): ParseResult | null => {
  const debitMatch = text.match(/Debited ([A-Z]{3})? ?([\d,]+(\.\d{2})?)/i);
  const creditMatch = text.match(/Credited ([A-Z]{3})? ?([\d,]+(\.\d{2})?)/i);

  if (!debitMatch && !creditMatch) return null;

  const isCredit = !!creditMatch;
  const match = isCredit ? creditMatch : debitMatch;
  const amountStr = match ? match[2].replace(/,/g, '') : '0';

  const descMatch = text.match(/Desc:? (.+?)(\.|$)/i);
  
  return {
    bankId: 'dashen',
    amount: parseFloat(amountStr),
    type: isCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
    date: new Date(),
    description: descMatch ? descMatch[1].trim() : 'Transaction',
  };
};

const parseAwash = (text: string): ParseResult | null => {
  const debitMatch = text.match(/debited ([A-Z]{3})? ?([\d,]+(\.\d{2})?)/i);
  const creditMatch = text.match(/credited ([A-Z]{3})? ?([\d,]+(\.\d{2})?)/i);
  
  if (!debitMatch && !creditMatch) return null;

  const isCredit = !!creditMatch;
  const match = isCredit ? creditMatch : debitMatch;
  const amountStr = match ? match[2].replace(/,/g, '') : '0';

  const forMatch = text.match(/for (.+?)(\.|$)/i);

  return {
    bankId: 'awash',
    amount: parseFloat(amountStr),
    type: isCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
    date: new Date(),
    description: forMatch ? forMatch[1].trim() : 'Awash Transaction',
  };
};

const parseGeneric = (text: string): ParseResult | null => {
  // Generic parser for any bank
  // Look for currency patterns: ETB 500, 500 ETB, Br. 500
  const amountRegex = /(?:ETB|Br\.?|BIRR)\s*([\d,]+(\.\d{1,2})?)|([\d,]+(\.\d{1,2})?)\s*(?:ETB|Br\.?|BIRR)/i;
  const match = text.match(amountRegex);

  if (!match) return null;

  const amountStr = (match[1] || match[3] || '0').replace(/,/g, '');
  const amount = parseFloat(amountStr);
  if (isNaN(amount)) return null;

  const isCredit = /credit|deposit|received|income/i.test(text);
  const isDebit = /debit|paid|sent|purchase|withdrawal|transfer/i.test(text);

  if (!isCredit && !isDebit) {
     return null; 
  }

  const descMatch = text.match(/(?:at|for|reason|desc|ref|info)[:\s]+(.+?)(?:\.|$)/i);
  const description = descMatch ? descMatch[1].trim() : 'Transaction';

  return {
    bankId: 'other',
    amount,
    type: isCredit ? TransactionType.CREDIT : TransactionType.DEBIT,
    date: new Date(),
    description,
  };
};

export const parseSMS = (text: string): Transaction | null => {
  let result: ParseResult | null = null;
  
  const lowerText = text.toLowerCase();
  
  // 1. Try Specific Parsers first for known formats that might be tricky
  if (lowerText.includes('cbe') || lowerText.includes('commercial bank')) {
    result = parseCBE(text);
  } else if (lowerText.includes('dashen')) {
    result = parseDashen(text);
  } else if (lowerText.includes('awash')) {
    result = parseAwash(text);
  } 
  
  // 2. If no result yet, try generic parsing
  if (!result) {
    result = parseCBE(text) || parseDashen(text) || parseAwash(text) || parseGeneric(text);
  }

  // 3. Post-processing: If we used generic parser (or any parser), 
  // try to refine the Bank ID based on the text content if it defaulted to 'other' or we just want to be sure.
  if (result) {
     // Check if we can find a supported bank name in the text
     const matchedBank = SUPPORTED_BANKS.find(b => 
        b.id !== 'other' && 
        (lowerText.includes(b.name.toLowerCase()) || 
         b.senderIds.some(sid => lowerText.includes(sid.toLowerCase())))
     );

     if (matchedBank) {
         result.bankId = matchedBank.id;
     }
  }

  if (!result) return null;

  const bank = SUPPORTED_BANKS.find(b => b.id === result!.bankId);

  return {
    id: crypto.randomUUID(),
    originalSms: text,
    bankName: bank ? bank.name : 'Other Bank',
    amount: result.amount,
    currency: 'ETB',
    type: result.type,
    date: result.date.toISOString(),
    description: result.description,
    category: result.type === TransactionType.CREDIT ? Category.INCOME : Category.OTHER,
    isAiClassified: false,
  };
};