import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { type Container, type ISourceOptions } from "@tsparticles/engine";
// tsParticles Slim is a lighter version, including only the necessary features for this animation
import { loadSlim } from "@tsparticles/slim";

const ParticleBackground: React.FC = () => {
    const [init, setInit] = useState(false);

    // this should be run only once per application lifetime
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
            // this loads the tsparticles package bundle, it's a convenience method to load everything
            // starting from v2 you can add only the features you need reducing the bundle size
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = async (container?: Container): Promise<void> => {
        // console.log("particles.js loaded", container);
    };

    // memoizing the options object to prevent unnecessary re-renders
    const options: ISourceOptions = useMemo(
        () => ({
            background: {
                color: {
                    value: "#f8fafc", // slate-50, very light gray-blue
                },
            },
            fpsLimit: 60,
            interactivity: {
                events: {
                    onHover: {
                        enable: true,
                        mode: "slow",
                    },
                    onClick: {
                        enable: false,
                    },
                },
                modes: {
                    slow: {
                        factor: 1.5,
                        radius: 150,
                    },
                },
            },
            particles: {
                color: {
                    value: ["#cbd5e1", "#94a3b8", "#f59e0b"], // slate-300, slate-400, amber-500
                },
                links: {
                    color: "#cbd5e1", // slate-300
                    distance: 150,
                    enable: true,
                    opacity: 0.3,
                    width: 1,
                },
                collisions: {
                    enable: false,
                },
                move: {
                    direction: "none",
                    enable: true,
                    outModes: {
                        default: "out",
                    },
                    random: true,
                    speed: 0.5, // Slower speed for a calmer effect
                    straight: false,
                },
                number: {
                    density: {
                        enable: true,
                        area: 800,
                    },
                    value: 60, // A reasonable number of particles
                },
                opacity: {
                    value: 0.4,
                    animation: {
                        enable: true,
                        speed: 0.5,
                        minimumValue: 0.1,
                        sync: false,
                    }
                },
                shape: {
                    type: "circle",
                },
                size: {
                    value: { min: 1, max: 3 }, // smaller particles
                     animation: {
                        enable: true,
                        speed: 2,
                        minimumValue: 1,
                        sync: false,
                    }
                },
            },
            detectRetina: true,
        }),
        [],
    );

    if (init) {
        return (
            <Particles
                id="tsparticles"
                particlesLoaded={particlesLoaded}
                options={options}
                className="w-full h-full"
            />
        );
    }

    return <></>;
};

export default React.memo(ParticleBackground);