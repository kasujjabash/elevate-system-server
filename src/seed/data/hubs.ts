export const hubsBaseData = [
  {
    name: 'Kosovo Hub',
    code: 'KOS',
    description: 'Elevate Academy Kosovo - Digital skills training center',
    location: 'Kosovo',
    address: 'Kosovo Learning Center, Main Campus',
    isActive: true,
  },
  {
    name: 'Jinja Hub',
    code: 'JIN',
    description: 'Elevate Academy Jinja - Digital skills training center',
    location: 'Jinja',
    address: 'Jinja Technology Center, River Road',
    isActive: true,
  },
  {
    name: 'Namayemba Hub',
    code: 'NAM',
    description: 'Elevate Academy Namayemba - Digital skills training center',
    location: 'Namayemba',
    address: 'Namayemba Innovation Hub, Central District',
    isActive: true,
  },
  {
    name: 'Lyantode Hub',
    code: 'LYA',
    description: 'Elevate Academy Lyantode - Digital skills training center',
    location: 'Lyantode',
    address: 'Lyantode Digital Center, Tech Park',
    isActive: true,
  },
  {
    name: 'Katanga Hub',
    code: 'KAT',
    description: 'Elevate Academy Katanga - Digital skills training center',
    location: 'Katanga',
    address: 'Katanga Skills Center, Education District',
    isActive: true,
  },
];

export const skillCategoriesBaseData = [
  {
    id: 'web-dev',
    name: 'Website Development',
    description:
      'Learn to build modern websites and web applications using HTML, CSS, JavaScript, and modern frameworks',
  },
  {
    id: 'video-prod',
    name: 'Video Production',
    description:
      'Master video production techniques including filming, editing, and post-production workflows',
  },
  {
    id: 'film-photo',
    name: 'Film and Photography',
    description:
      'Develop skills in film making and professional photography techniques',
  },
  {
    id: 'ui-ux',
    name: 'UI/UX Design',
    description:
      'Learn user interface and user experience design principles and tools',
  },
  {
    id: 'digital-marketing',
    name: 'Digital Marketing',
    description:
      'Understand digital marketing strategies, social media, and online brand building',
  },
];

export const coursesBaseData = [
  {
    title: 'Frontend Web Development',
    description:
      'Learn HTML, CSS, JavaScript, and React to build modern web applications',
    duration: '12 weeks',
    level: 'Beginner',
    maxStudents: 25,
    skillCategoryId: 'web-dev',
  },
  {
    title: 'Backend Development',
    description: 'Master Node.js, databases, and API development',
    duration: '10 weeks',
    level: 'Intermediate',
    maxStudents: 20,
    skillCategoryId: 'web-dev',
  },
  {
    title: 'Video Editing Fundamentals',
    description:
      'Learn professional video editing using Adobe Premiere Pro and Final Cut Pro',
    duration: '8 weeks',
    level: 'Beginner',
    maxStudents: 15,
    skillCategoryId: 'video-prod',
  },
  {
    title: 'Photography Basics',
    description: 'Master camera techniques, composition, and photo editing',
    duration: '6 weeks',
    level: 'Beginner',
    maxStudents: 20,
    skillCategoryId: 'film-photo',
  },
  {
    title: 'UI Design with Figma',
    description:
      'Create beautiful user interfaces using Figma and design principles',
    duration: '8 weeks',
    level: 'Beginner',
    maxStudents: 18,
    skillCategoryId: 'ui-ux',
  },
  {
    title: 'UX Research and Design',
    description: 'Learn user research methods and create user-centered designs',
    duration: '10 weeks',
    level: 'Intermediate',
    maxStudents: 15,
    skillCategoryId: 'ui-ux',
  },
];
