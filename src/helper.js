import { format } from "date-fns";

export const dateAndTimeFormat=(str) =>{
   if (!str) return '';
   return format(new Date(str), 'dd-MM-yyyy HH:mm:ss');
} 
export const dateFormat=(str)=>{
   if (!str) return '';
   return format(new Date(str), 'dd-MMM-yyyy');
}