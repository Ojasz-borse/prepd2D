export const formatLocationName = (loc: string): string => {
  return loc.charAt(0).toUpperCase() + loc.slice(1);
};

export const formatBranchName = (branch: string): string => {
  return branch.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
};