import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import { Autoplay } from "swiper/modules";

const ImageCarousel = ({
  images,
}: {
  images: {
    _id: string;
    name: string;
    url: string;
  }[];
}) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{ delay: 5000 }}
      loop={true}
      className="h-56 md:h-96"
    >
      {images.length != 0 ? (
        images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image.url}
              alt={image.name}
              className="object-cover w-full h-full"
            />
          </SwiperSlide>
        ))
      ) : (
        <SwiperSlide>
          <img
            src="/blank.png"
            alt="blank"
            className="object-cover w-full h-full"
          />
        </SwiperSlide>
      )}
    </Swiper>
  );
};

export default ImageCarousel;
