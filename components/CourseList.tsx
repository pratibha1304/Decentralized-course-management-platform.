import React, { useEffect, useState } from "react";
import aptos from "../services/AptosService";

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        console.log("Fetching courses...");
        const response = await aptos.view({
          payload: {
            function: "0xYourContractAddress::course_module::get_courses",
            typeArguments: [],
            functionArguments: [],
          },
        });
        console.log("Response received:", response);
        setCourses(response.map((course: any) => String(course)));
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded">
      <h2 className="text-xl font-bold">Available Courses</h2>
      {loading ? <p>Loading...</p> : courses.length > 0 ? (
        <ul>
          {courses.map((course, index) => (
            <li key={index} className="p-2 border-b border-gray-700">
              {course}
            </li>
          ))}
        </ul>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default CourseList;
