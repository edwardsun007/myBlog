/* we create our own post type
export it so that our app can use it,
interface, class are blueprints!
interface cannot be instantiated, it cannot be used for creating any instance
*/

export interface Post {
  id: string;
  title: string;
  content: string;
  imagePath: string;
  creator: string;
}
