import { db } from "@/db/db";
import { Project } from "@/types/userTypes";

// create new project
export const createProject = async ({
  id,
  name,
  updatedAt,
}: Project): Promise<void> => {
  await db.projects.put({ id, name, updatedAt });
};

//delete project by id
export const deleteProject = async (id: string): Promise<void> => {
  await db.projects.delete(id);
};

//rename project by id
export const updateProjectName = async (
  id: string,
  newName: string,
): Promise<void> => {
  const updated = await db.projects.update(id, { name: newName });
  if (!updated) {
    throw new Error("Project not found");
  }
};

//git all projects in the db
export const getAllProjects = async (): Promise<Project[]> => {
  const projects = await db.projects.toArray();
  return projects;
};

//delete all projects in the db
export const deleteAllProjects = async (): Promise<void> => {
  await db.projects.clear();
};

//get data by id
export const getProjectById = async (
  id: string,
): Promise<Project | undefined> => {
  return await db.projects.get(id);
};
