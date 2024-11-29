/// <reference lib="webworker" />

import { User, GroupingCriteria } from "../../models/user.model";

addEventListener("message", ({ data }) => {
  const { users, criteria } = data;

  const userInstances = users.map((user: any) =>
    Object.assign(new User(), user)
  );

  let groupedUsers: Record<string, User[]> = {};

  switch (criteria) {
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
  const flatUsers = Object.values(groupedUsers).flat();

  // Send the flat array back to the main thread
  postMessage(flatUsers);
});
