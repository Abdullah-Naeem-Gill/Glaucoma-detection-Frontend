import man from "../assets/man.png";
import female from "../assets/female.png";

/**
 * Returns a valid doctor image.
 * If a custom image is provided, it returns that.
 * Otherwise, it returns a default image based on gender.
 */
export function getDoctorImage(image, gender) {
  if (image && image.trim() !== "") return image;
  return gender === "female" ? female : man;
}
