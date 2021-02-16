export const categoryClasses = (category: string) => {
  if (category === 'work') {
    return 'purple';
  }
  if (category === 'personal') {
    return 'green';
  }
  if (category === 'errand') {
    return 'red';
  }
  return 'brown';
};
