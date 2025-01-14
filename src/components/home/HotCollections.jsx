import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import OwlCarousel from "react-owl-carousel";

const HotCollections = () => {
  const [collections, setCollections] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      const response = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections"
      );
      setCollections(response.data);
    };

    fetchData();

    const timeout = setTimeout(() => {
      setIsLoading(false); // Update state after timeout
    }, 1000);

    // Cleanup the timeout when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

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
        <div className="item" key={index}>
          <div className="nft_coll">
            <div className="nft_wrap">
              <Skeleton height={200} />
            </div>
            <div className="nft_coll_pp">
              <Skeleton circle={true} height={50} width={50} />
            </div>
            <div className="nft_coll_info">
              <Skeleton className="nft_coll_info--skeleton" width="60%" />
              <Skeleton className="nft_coll_info--skeleton" width="40%" />
            </div>
          </div>
        </div>
      ));
  };

  return (
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-lg-12">
            <OwlCarousel
              key={isLoading ? "loading" : collections.length} // Force re-render
              className="owl-theme"
              {...carouselOptions}
            >
              {isLoading
                ? renderSkeletons()
                : collections.map((nft, index) => (
                    <div className="item" key={index}>
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <Link to={`/item-details/${nft.nftId}`}>
                            <img
                              src={nft.nftImage}
                              className="lazy img-fluid"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="nft_coll_pp">
                          <Link to={`/author/${nft.authorId}`}>
                            <img
                              className="lazy pp-coll"
                              src={nft.authorImage}
                              alt=""
                            />
                          </Link>
                          <i className="fa fa-check"></i>
                        </div>
                        <div className="nft_coll_info">
                          <Link to="/explore">
                            <h4>{nft.title}</h4>
                          </Link>
                          <span>ERC-{nft.code}</span>
                        </div>
                      </div>
                    </div>
                  ))}
            </OwlCarousel>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
