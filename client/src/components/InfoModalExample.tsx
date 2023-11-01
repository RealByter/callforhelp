import React, { useState } from 'react';
import InfoModal from './InfoModal';
import { GeneralCarousel } from './GeneralCarousel';

const InfoModalExample = () => {
  const [show, setShow] = useState(true);

  return (
    <>
      {show ? (
        <InfoModal
          title="מה כדאי לדעת כתומך"
          subtext="הנה מספר דגשים ונקודות שכדאי לשים לב אליהם במהלך שיחה "
          onClose={() => setShow(false)}>
          <GeneralCarousel
            items={[
              <div>
                <h3>משהו חשוב 1</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse purus ligula,
                  accumsan eu tincidunt a, scelerisque rutrum turpis. Donec justo purus, commodo
                  vitae ipsum eu, vestibulum condimentum ipsum. Donec pretium porta eros, nec
                  pellentesque elit feugiat et. In et mattis libero, et laoreet magna. Pellentesque
                  at
                </p>
              </div>,
              <div>
                <h3>משהו חשוב 2</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse purus ligula,
                  accumsan eu tincidunt a, scelerisque rutrum turpis. Donec justo purus, commodo
                  vitae ipsum eu, vestibulum condimentum ipsum. Donec pretium porta eros, nec
                  pellentesque elit feugiat et. In et mattis libero, et laoreet magna. Pellentesque
                  at
                </p>
              </div>,
              <div>
                <h3>משהו חשוב 3</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse purus ligula,
                  accumsan eu tincidunt a, scelerisque rutrum turpis. Donec justo purus, commodo
                  vitae ipsum eu, vestibulum condimentum ipsum. Donec pretium porta eros, nec
                  pellentesque elit feugiat et. In et mattis libero, et laoreet magna. Pellentesque
                  at
                </p>
              </div>,
              <div>
                <h3>משהו חשוב 4</h3>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse purus ligula,
                  accumsan eu tincidunt a, scelerisque rutrum turpis. Donec justo purus, commodo
                  vitae ipsum eu, vestibulum condimentum ipsum. Donec pretium porta eros, nec
                  pellentesque elit feugiat et. In et mattis libero, et laoreet magna. Pellentesque
                  at
                </p>
              </div>
            ]}
          />
        </InfoModal>
      ) : (
        <></>
      )}
      d<h1>Hello</h1>
    </>
  );
};

export default InfoModalExample;
