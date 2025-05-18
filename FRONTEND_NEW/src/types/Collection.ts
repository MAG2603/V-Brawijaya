type Collection = {
  _id: string;
  identifier: string;
  name: string;
  year: number;
  category: { _id: string; name: string; description: string };
  description: string;
  history: string;
  language: string;
  creator: string;
  subject: string;
  publisher: string;
  contributor: string;
  copyright: string;
  date: Date;
  format: string;
  source: string;
  museumEntryYear: number;
  images: { _id: string; name: string; url: string }[];
  audio: { name: string; url: string };
  createdBy: {
    _id: string;
    fullname: string;
    username: string;
  };
};

export default Collection;
