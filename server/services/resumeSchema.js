function createEmptyResume() {
  return {
    personal: {
      name: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: ""
    },

    summary: "",

    skills: [],

    education: [],

    experience: [],

    projects: [],

    certifications: [],

    achievements: [],

    languages: [],

    
    nerEntities: {
  persons: [],
  organizations: [],
  locations: [],
  miscellaneous: []
},

    rawText: ""
  };
}

module.exports = createEmptyResume;