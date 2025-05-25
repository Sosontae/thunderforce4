#!/bin/bash

echo "🔊 Generating additional sound effects with sox..."

cd assets/audio

# Alternative shoot sound
sox -n shoot_01.ogg synth 0.15 sine 600-300 fade 0 0.15 0.05

# Alternative explosion
sox -n retro_explosion.ogg synth 0.8 brownnoise fade 0 0.8 0.3 gain -10

# Hit/impact sound
sox -n retro_laser_01.ogg synth 0.1 square 200-100 fade 0 0.1 0.05

# Menu select beep
sox -n beep_01.ogg synth 0.1 sine 600 fade 0 0.1 0.05

# Menu move sound
sox -n terminal_01.ogg synth 0.05 square 800 fade 0 0.05 0.02

# Weapon switch sound
sox -n weapon_switch.ogg synth 0.2 sawtooth 300-600 fade 0 0.2 0.1

# Misc sounds
sox -n misc_01.ogg synth 0.3 sine 440:880 fade 0 0.3 0.1  # Level start
sox -n misc_09.ogg synth 0.5 square 100:200 tremolo 10 fade 0 0.5 0.2  # Boss warning

# Power-up collection
sox -n powerup.ogg synth 0.3 sine 440:880:1320 fade 0 0.3 0.1

# Shield hit
sox -n shield_hit.ogg synth 0.1 noise highpass 2000 fade 0 0.1 0.05

# Speed boost
sox -n speed_boost.ogg synth 0.2 sawtooth 200-800 fade 0 0.2 0.1

# Enemy hit
sox -n enemy_hit.ogg synth 0.08 square 150-50 fade 0 0.08 0.02

# Player hit
sox -n player_hit.ogg synth 0.15 noise lowpass 500 fade 0 0.15 0.05

# Boss explosion (longer, more dramatic)
sox -n boss_explosion.ogg synth 1.5 brownnoise fade 0 1.5 0.5 tremolo 5 gain -5

# Charge up sound
sox -n charge_up.ogg synth 1 sine 100-1000 fade 0.1 0.8 0.1

# Laser beam
sox -n laser_beam.ogg synth 0.5 sawtooth 2000-500 fade 0 0.5 0.2

cd ../..

echo "✅ Sound effects generated!" 