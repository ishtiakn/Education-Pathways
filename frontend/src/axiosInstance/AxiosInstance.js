import axios from "axios";

const myInstance = axios.create({
  baseURL: "https://agility-education-pathways.herokuapp.com",
});

export default myInstance;
