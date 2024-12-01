/// <reference lib="webworker" />

import { User, GroupingCriteria } from "../../models/user.model";

addEventListener("message", ({ data }) => {
  const { users, group, search } = data;
  const userInstances = users.map((user: any) =>
    Object.assign(new User(), user)
  );
  let filteredUsers: User[] = users;

  if (group) {
    let groupedUsers: Record<string, User[]> = {};

    switch (group) {
      case GroupingCriteria.Alphabetically:
        groupedUsers = userInstances.reduce(
          (acc: Record<string, User[]>, user: User) => {
            if (user.firstname) {
              const firstLetter = user.firstname[0].toUpperCase();
              acc[firstLetter] = acc[firstLetter] || [];
              acc[firstLetter].push(user);
            }
            return acc;
          },
          {}
        );
        break;

      case GroupingCriteria.Age:
        groupedUsers = userInstances.reduce(
          (acc: Record<string, User[]>, user: User) => {
            if (user.age !== undefined) {
              const ageGroup = Math.floor(user.age / 10) * 10 + "s";
              acc[ageGroup] = acc[ageGroup] || [];
              acc[ageGroup].push(user);
            }
            return acc;
          },
          {}
        );
        break;

      case GroupingCriteria.Nationality:
        groupedUsers = userInstances.reduce(
          (acc: Record<string, User[]>, user: User) => {
            if (user.nat) {
              const nationality = user.nat;
              acc[nationality] = acc[nationality] || [];
              acc[nationality].push(user);
            }
            return acc;
          },
          {}
        );
        break;

      default:
        postMessage({ error: "Invalid grouping criteria" });
        return;
    }

    // Transform grouped users (key-value) into a flat array
    filteredUsers = Object.values(groupedUsers).flat();
  }
  if (search?.length) {
    const query = search.toLowerCase();

    filteredUsers = filteredUsers.filter((user: User) => {
      const fullName = `${user.firstname} ${user.lastname}`.toLowerCase();

      return (
        fullName.includes(query) ||
        user.phone?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.nat?.toLowerCase().includes(query)
      );
    });
  }

  // Send the flat array back to the main thread
  const result = filteredUsers.length > 0 ? filteredUsers : users;
  postMessage(result);
});
