import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AuthorImage from "../../images/author_thumbnail.jpg";
import axios from "axios";
import Skeleton from "react-loading-skeleton";

const TopSellers = () => {
  const [sellers, setSellers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers"
      );
      setSellers(response.data);
    };

    fetchData();
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  function renderSkeletons() {
    return (
      <>
        <div className="col-lg-12">
          <div className="text-center">
            <h2>Top Sellers</h2>
            <div className="small-border bg-color-2"></div>
          </div>
        </div>

        <div className="col-md-12">
          <ol className="author_list">
            {new Array(12).fill(0).map((_, index) => (
              <li key={index}>
                <div className="author_list_pp">
                  <Skeleton circle={true} height={50} width={50}></Skeleton>
                </div>
                <div className="author_list_info">
                  <Skeleton width={60} height={20}></Skeleton>
                  <Skeleton width={40} height={20}></Skeleton>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  }

  return isLoading ? (
    renderSkeletons()
  ) : (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="col-md-12">
            <ol className="author_list">
              {sellers.map((seller, index) => (
                <li key={index}>
                  <div className="author_list_pp">
                    <Link to={`/author/${seller.authorId}`}>
                      <img
                        className="lazy pp-author"
                        src={seller.authorImage}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <div className="author_list_info">
                    <Link to={`/author/${seller.authorId}`}>
                      {seller.authorName}
                    </Link>
                    <span>{seller.price} ETH</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
