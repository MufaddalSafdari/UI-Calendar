declare module '*.json' {
  const value: {
    date: string;
    department: string;
    event: string;
  }[];
  export default value;
}