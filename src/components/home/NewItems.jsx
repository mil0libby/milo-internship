import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import Skeleton from "react-loading-skeleton";
import Countdown from "../UI/Countdown";

const NewItems = () => {
  const [items, setItems] = useState([]);

  const [isLoading, setIsLoading] = useState(true); // Track loading state

  const carouselOptions = {
    items: 4,
    margin: 15,
    loop: true,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 2 },
      800: { items: 3 },
      1000: { items: 4 },
    },
  };

  const renderSkeletons = () => {
    return Array(4)
      .fill()
      .map((_, index) => (
        <div key={index} className="nft__item">
          <div className="author_list_pp">
            <Skeleton circle={true} height={50} width={50}></Skeleton>
          </div>
          <div className="nft__item_wrap">
            <div className="nft__item_extra">
              <div className="nft__item_buttons"></div>
            </div>
            <div className="nft__img--wrapper">
              <Skeleton height={200}></Skeleton>
            </div>
          </div>
          <div className="nft__item_info">
            <Skeleton className="nft_coll_info--skeleton" width="60%" />
            <Skeleton className="nft_coll_info--skeleton" width="40%" />
          </div>
        </div>
      ));
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems"
      );
      setItems(response.data);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <OwlCarousel
            key={isLoading ? "loading" : items.length}
            className="owl-theme"
            {...carouselOptions}
          >
            {isLoading
              ? renderSkeletons()
              : items.map((item, index) => (
                  <div key={index} className="nft__item" data-aos="fade-in">
                    <div className="author_list_pp">
                      <Link
                        to={`/author/${item.authorId}`}
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="NFT Creator"
                      >
                        <img className="lazy" src={item.authorImage} alt="" />
                        <i className="fa fa-check"></i>
                      </Link>
                    </div>
                    {item.expiryDate && (
                      <Countdown timeLeft={item.expiryDate}></Countdown>
                    )}

                    <div className="nft__item_wrap">
                      <div className="nft__item_extra">
                        <div className="nft__item_buttons">
                          <button>Buy Now</button>
                          <div className="nft__item_share">
                            <h4>Share</h4>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-facebook fa-lg"></i>
                            </a>
                            <a href="" target="_blank" rel="noreferrer">
                              <i className="fa fa-twitter fa-lg"></i>
                            </a>
                            <a href="">
                              <i className="fa fa-envelope fa-lg"></i>
                            </a>
                          </div>
                        </div>
                      </div>

                      <Link to={`/item-details/${item.nftId}`}>
                        <img
                          src={item.nftImage}
                          className="lazy nft__item_preview"
                          alt=""
                        />
                      </Link>
                    </div>
                    <div className="nft__item_info">
                      <Link to={`/item-details/${item.nftId}`}>
                        <h4>{item.title}</h4>
                      </Link>
                      <div className="nft__item_price">{item.price} ETH</div>
                      <div className="nft__item_like">
                        <i className="fa fa-heart"></i>
                        <span>{item.likes}</span>
                      </div>
                    </div>
                  </div>
                ))}
          </OwlCarousel>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
