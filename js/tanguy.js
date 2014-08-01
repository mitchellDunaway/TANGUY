//VENDOR PREFIXING
window.AudioContext = window.AudioContext || window.webkitAudioContext;

//THE ONE GLOBAL VARIABLE
var TANGUY = {

    voice1: new AudioContext(),

    //SENSIBLE DEFAULTS
    octave_shift: 0,
    osc1_pitch: 440,
    osc2_pitch: 443.1192,

    program: {
        name: "INITIALIZE",
        osc1: {
            kbd: true,
            coarse: 1,
            saw_amt: 1,
            sqr_amt: 0,
            tri_amt: 0,
            sin_amt: 0,
            fm_amt: 0
        },
        osc2: {
            kbd: true,
            coarse: 1,
            waveform: "sine",
            detune: 0,
            fine: 0,
            shape_amt: 0,
            fm_amt: 0
        },
        noise: {
            color: "white"
        },
        lfo: {
            shape: "sine",
            rate: 2.2,
            pitch_amt: 0,
            filter_amt: 0,
            amp_amt: 0
        },
        mixer: {
            osc1: 1,
            osc2: 1,
            noise: 0
        },
        filter: {
            mode: "lp",
            frequency: 22050,
            resonance: 0.00009999999747378752,
            env_amt: 0,
            kbd: 0,
            attack: 0,
            decay: 0,
            sustain: 0,
            release: 0
        },
        vca: {
            gain: 0,
            attack: 0,
            decay: 0,
            sustain: 1,
            release: 0
        },
        portamento: {
            mode: "off",
            amt: 0.01
        },
        mod: {
            amt: 0,
            direction: 1
        }
    },

    //FUNCTIONALITY
    help: function () {
        console.log('Don\'t use filter in HP mode.');
        console.log('BUGGY: VCA gain if you turn it up after playing a note until retriggering keyboard');
    },

    shift_octave: function (direction) {
        var shift_octave_lights = function (octave_shift) {
            console.log('OCTAVE SHIFT IS ' + octave_shift);
            switch (octave_shift) {
            case -2:
                $('.octave-minus-2').addClass('lit');
                $('.octave-minus-1').removeClass('lit');
                break;
            case -1:
                $('.octave-minus-2').removeClass('lit');
                $('.octave-minus-1').addClass('lit');
                $('.octave-plus-0').removeClass('lit');
                break;
            case 0:
                $('.octave-minus-1').removeClass('lit');
                $('.octave-plus-0').addClass('lit');
                $('.octave-plus-1').removeClass('lit');
                break;
            case 1:
                $('.octave-plus-0').removeClass('lit');
                $('.octave-plus-1').addClass('lit');
                $('.octave-plus-2').removeClass('lit');
                break;
            case 2:
                $('.octave-plus-1').removeClass('lit');
                $('.octave-plus-2').addClass('lit');
                break;
            };
        };
        if (direction > 0 && TANGUY.octave_shift < 2) {
            TANGUY.octave_shift = TANGUY.octave_shift + 1;
        } else if (direction < 1 && TANGUY.octave_shift > -2) {
            TANGUY.octave_shift = TANGUY.octave_shift - 1;
        }
        shift_octave_lights(TANGUY.octave_shift);
    },

    multi_switch: function (gizmo) {//TRY "this"
        console.log('VALUE OF THIS SWITCH IS ' + $(gizmo).val());
        $(gizmo).parent().addClass('selected');
        $(gizmo).parent().siblings().removeClass('selected');
    },

    calculate_pitch: function (pos, note_value) {
        var note = ((TANGUY.octave_shift + pos) * 1200) + note_value,
        osc2_note = ((TANGUY.octave_shift + pos) * 1200) + (note_value + TANGUY.program.osc2.detune);
        TANGUY.osc1_pitch = note;
        TANGUY.osc2_pitch = osc2_note;
        //FILTER KEYBOARD TRACKING
        if (TANGUY.program.filter.kbd > 0) {
            var kbd = parseFloat(note * TANGUY.program.filter.kbd) + 4500;
            TANGUY.lp_filter1.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.lp_filter2.detune.setValueAtTime(parseFloat(kbd / 2), TANGUY.voice1.currentTime),
            TANGUY.bp_filter1.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.bp_filter2.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.bp_filter3.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.hp_filter1.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.hp_filter2.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.hp_filter3.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.notch1.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.notch2.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime),
            TANGUY.notch3.detune.setValueAtTime(parseFloat(kbd), TANGUY.voice1.currentTime);
        }
        if (TANGUY.program.osc1.kbd == true && TANGUY.program.osc2.kbd == true) {
            //SET BOTH OSCILLATORS
            switch (TANGUY.program.portamento.mode) {
            case "off":
              TANGUY.osc1_saw.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc1_sqr.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc1_tri.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc1_sin.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc2.detune.setValueAtTime(osc2_note, TANGUY.voice1.currentTime);
              break;
            case "linear":
              TANGUY.osc1_saw.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc1_sqr.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc1_tri.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc1_sin.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc2.detune.linearRampToValueAtTime(osc2_note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt)));
              break;
            case "exponential":
              TANGUY.osc1_saw.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc1_sqr.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc1_tri.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc1_sin.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc2.detune.setTargetAtTime(osc2_note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5));
              break;
            }
        } else if (TANGUY.program.osc1.kbd == true && TANGUY.program.osc2.kbd == false) {
            //SET OSC 1
            switch (TANGUY.program.portamento.mode) {
            case "off":
              TANGUY.osc1_saw.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc1_sqr.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc1_tri.detune.setValueAtTime(note, TANGUY.voice1.currentTime),
              TANGUY.osc1_sin.detune.setValueAtTime(note, TANGUY.voice1.currentTime);
              break;
            case "linear":
              TANGUY.osc1_saw.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc1_sqr.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc1_tri.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt))),
              TANGUY.osc1_sin.detune.linearRampToValueAtTime(note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt)));
              break;
            case "exponential":
              TANGUY.osc1_saw.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc1_sqr.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc1_tri.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5)),
              TANGUY.osc1_sin.detune.setTargetAtTime(note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5));
              break;
            }
        } else if (TANGUY.program.osc1.kbd == false && TANGUY.program.osc2.kbd == true) {
            //SET OSC 2
            switch (TANGUY.program.portamento.mode) {
            case "off":
              TANGUY.osc2.detune.setValueAtTime(osc2_note, TANGUY.voice1.currentTime);
              break;
            case "linear":
              TANGUY.osc2.detune.linearRampToValueAtTime(osc2_note, (TANGUY.voice1.currentTime + parseFloat(TANGUY.program.portamento.amt)));
              break;
            case "exponential": 
              TANGUY.osc2.detune.setTargetAtTime(osc2_note, TANGUY.voice1.currentTime, (TANGUY.program.portamento.amt / 5));
              break;
            }
        } else {
            console.log('No oscillators are tracking the keyboard');
        };
    },

    gate_on: function () {
        var pos = parseInt(this.getAttribute('data-keyboard-position')),
        note_value = parseInt(this.getAttribute('data-note-value'));
        TANGUY.calculate_pitch(pos, note_value);

        (function attack() {
            var filter_eg = parseFloat(TANGUY.program.filter.env_amt + TANGUY.program.filter.frequency),
            filter_end_of_attack = parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack),
            vca_end_of_attack = parseFloat(TANGUY.voice1.currentTime + TANGUY.program.vca.attack);

            TANGUY.lp_filter1.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.lp_filter2.frequency.setValueAtTime(parseFloat((TANGUY.program.filter.frequency) / 2), TANGUY.voice1.currentTime),
            TANGUY.lp_filter1.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.lp_filter2.frequency.linearRampToValueAtTime((filter_eg / 2), parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),

            TANGUY.bp_filter1.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.bp_filter2.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.bp_filter3.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.bp_filter1.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.bp_filter2.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.bp_filter3.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),

            TANGUY.hp_filter1.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.hp_filter2.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.hp_filter3.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.hp_filter1.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.hp_filter2.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.hp_filter3.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),

            TANGUY.notch1.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.notch2.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.notch3.frequency.setValueAtTime(parseFloat(TANGUY.program.filter.frequency), TANGUY.voice1.currentTime),
            TANGUY.notch1.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.notch2.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),
            TANGUY.notch3.frequency.linearRampToValueAtTime(filter_eg, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.filter.attack)),

            TANGUY.vca.gain.setValueAtTime((0 + TANGUY.program.vca.gain), TANGUY.voice1.currentTime),
            TANGUY.vca.gain.linearRampToValueAtTime(1, parseFloat(TANGUY.voice1.currentTime + TANGUY.program.vca.attack)),

            //DECAY
            TANGUY.lp_filter1.frequency.setTargetAtTime(parseFloat(TANGUY.program.filter.frequency) + (TANGUY.program.filter.env_amt * TANGUY.program.filter.sustain), filter_end_of_attack, TANGUY.program.filter.decay),
            TANGUY.lp_filter2.frequency.setTargetAtTime((parseFloat(TANGUY.program.filter.frequency) + (TANGUY.program.filter.env_amt * TANGUY.program.filter.sustain) / 2), filter_end_of_attack, TANGUY.program.filter.decay),
            TANGUY.vca.gain.setTargetAtTime((TANGUY.program.vca.sustain + TANGUY.program.vca.gain), vca_end_of_attack, TANGUY.program.vca.decay);
        })();
    },

    gate_off: function () {
        var filter_release_peak = TANGUY.lp_filter1.frequency.value,
        vca_release_peak = TANGUY.vca.gain.value;

        (function release() {
            TANGUY.lp_filter1.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.lp_filter2.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.lp_filter1.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.lp_filter2.frequency.setValueAtTime((filter_release_peak / 2), TANGUY.voice1.currentTime),
            TANGUY.lp_filter1.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.lp_filter2.frequency.setTargetAtTime((TANGUY.program.filter.frequency / 2), TANGUY.voice1.currentTime, TANGUY.program.filter.release),

            TANGUY.bp_filter1.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.bp_filter2.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.bp_filter3.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.bp_filter1.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.bp_filter2.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.bp_filter3.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.bp_filter1.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.bp_filter2.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.bp_filter3.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),

            TANGUY.hp_filter1.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.hp_filter2.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.hp_filter3.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.hp_filter1.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.hp_filter2.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.hp_filter3.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.hp_filter1.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.hp_filter2.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.hp_filter3.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),

            TANGUY.notch1.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.notch2.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.notch3.frequency.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.notch1.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.notch2.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.notch3.frequency.setValueAtTime(filter_release_peak, TANGUY.voice1.currentTime),
            TANGUY.notch1.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.notch2.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),
            TANGUY.notch3.frequency.setTargetAtTime(TANGUY.program.filter.frequency, TANGUY.voice1.currentTime, TANGUY.program.filter.release),

            TANGUY.vca.gain.cancelScheduledValues(TANGUY.voice1.currentTime),
            TANGUY.vca.gain.setValueAtTime(vca_release_peak, TANGUY.voice1.currentTime),
            TANGUY.vca.gain.setTargetAtTime(TANGUY.program.vca.gain, TANGUY.voice1.currentTime, TANGUY.program.vca.release);
        })();
    },

}

//VCA
TANGUY.vca = TANGUY.voice1.createGain();
TANGUY.vca.gain.value = parseFloat(TANGUY.program.vca.gain);
TANGUY.vca.connect(TANGUY.voice1.destination);

//LP FILTER
TANGUY.lp_filter1 = TANGUY.voice1.createBiquadFilter();
TANGUY.lp_filter2 = TANGUY.voice1.createBiquadFilter();
TANGUY.lp_filter1.type = "lowpass";
TANGUY.lp_filter2.type = "lowpass";
TANGUY.lp_filter1.frequency.value = parseFloat(TANGUY.program.filter.frequency);
TANGUY.lp_filter2.frequency.value = parseFloat(TANGUY.program.filter.frequency / 2);
TANGUY.lp_filter1.Q.value = parseFloat((TANGUY.program.filter.resonance / 17) * 0.8692);
TANGUY.lp_filter2.Q.value = parseFloat((TANGUY.program.filter.resonance / 35) * 0.8692);
TANGUY.lp_filter1.connect(TANGUY.lp_filter2);
TANGUY.lp_filter2.connect(TANGUY.vca);

//BP FILTER
TANGUY.bp_filter1 = TANGUY.voice1.createBiquadFilter();
TANGUY.bp_filter2 = TANGUY.voice1.createBiquadFilter();
TANGUY.bp_filter3 = TANGUY.voice1.createBiquadFilter();
TANGUY.bp_filter1.type = "bandpass";
TANGUY.bp_filter2.type = "peaking";
TANGUY.bp_filter3.type = "peaking";
TANGUY.bp_filter1.frequency.value = parseFloat(TANGUY.program.filter.frequency);
TANGUY.bp_filter2.frequency.value = parseFloat((TANGUY.program.filter.frequency - (TANGUY.program.filter.frequency / 11)));
TANGUY.bp_filter3.frequency.value = parseFloat((TANGUY.program.filter.frequency + (TANGUY.program.filter.frequency / 11)));
TANGUY.bp_filter1.Q.value = 2;
TANGUY.bp_filter2.Q.value = 3;
TANGUY.bp_filter3.Q.value = 3;
TANGUY.bp_filter2.gain.value = parseFloat(TANGUY.program.filter.resonance / 166);
TANGUY.bp_filter3.gain.value = parseFloat(TANGUY.program.filter.resonance / 166);
TANGUY.bp_filter1.connect(TANGUY.bp_filter2);
TANGUY.bp_filter2.connect(TANGUY.bp_filter3);
TANGUY.bp_filter3.connect(TANGUY.vca);

//HP FILTER
TANGUY.hp_filter1 = TANGUY.voice1.createBiquadFilter();
TANGUY.hp_filter2 = TANGUY.voice1.createBiquadFilter();
TANGUY.hp_filter3 = TANGUY.voice1.createBiquadFilter();
TANGUY.hp_filter1.type = "highpass";
TANGUY.hp_filter2.type = "highpass";
TANGUY.hp_filter3.type = "peaking";
TANGUY.hp_filter1.frequency.value = parseFloat(TANGUY.program.filter.frequency);
TANGUY.hp_filter2.frequency.value = parseFloat(TANGUY.program.filter.frequency);
TANGUY.hp_filter3.frequency.value = parseFloat(TANGUY.program.filter.frequency);
TANGUY.hp_filter1.Q.value = parseFloat(TANGUY.program.filter.resonance);
TANGUY.hp_filter2.Q.value = parseFloat(TANGUY.program.filter.resonance);
TANGUY.hp_filter3.Q.value = parseFloat(TANGUY.program.filter.resonance / 200);
TANGUY.hp_filter3.gain.value = 12;
TANGUY.hp_filter1.connect(TANGUY.hp_filter2);
TANGUY.hp_filter2.connect(TANGUY.hp_filter3);
TANGUY.hp_filter3.connect(TANGUY.vca);

//NOTCH FILTER
TANGUY.notch1 = TANGUY.voice1.createBiquadFilter();
TANGUY.notch2 = TANGUY.voice1.createBiquadFilter();
TANGUY.notch3 = TANGUY.voice1.createBiquadFilter();
TANGUY.notch1.type = "notch";
TANGUY.notch2.type = "peaking";
TANGUY.notch3.type = "peaking";
TANGUY.notch1.frequency.value = parseFloat(TANGUY.program.filter.frequency);
TANGUY.notch2.frequency.value = parseFloat(TANGUY.program.filter.frequency - (TANGUY.program.filter.frequency / 6));
TANGUY.notch3.frequency.value = parseFloat(TANGUY.program.filter.frequency + (TANGUY.program.filter.frequency / 6));
TANGUY.notch1.Q.value = 2;
TANGUY.notch2.Q.value = 3;
TANGUY.notch3.Q.value = 3;
TANGUY.notch2.gain.value = parseFloat(TANGUY.program.filter.resonance / 166);
TANGUY.notch3.gain.value = parseFloat(TANGUY.program.filter.resonance / 166);
TANGUY.notch1.connect(TANGUY.notch2);
TANGUY.notch2.connect(TANGUY.notch3);
TANGUY.notch3.connect(TANGUY.vca);

//MIXER SECTION
TANGUY.mixer = TANGUY.voice1.createGain();
TANGUY.osc1_vca = TANGUY.voice1.createGain();
TANGUY.osc2_vca = TANGUY.voice1.createGain();
TANGUY.noise_vca = TANGUY.voice1.createGain();
TANGUY.ext_in_vca = TANGUY.voice1.createGain();
TANGUY.mixer.gain.value = 1;
TANGUY.osc1_vca.gain.value = TANGUY.program.mixer.osc1;
TANGUY.osc2_vca.gain.value = TANGUY.program.mixer.osc2;
TANGUY.noise_vca.gain.value = TANGUY.program.mixer.noise;
TANGUY.ext_in_vca.gain.value = 0;
TANGUY.mixer.connect(TANGUY.lp_filter1);
TANGUY.osc1_vca.connect(TANGUY.mixer);
TANGUY.osc2_vca.connect(TANGUY.mixer);
TANGUY.noise_vca.connect(TANGUY.mixer);
TANGUY.ext_in_vca.connect(TANGUY.mixer);

//OSC 1 VCAS
TANGUY.osc1_saw_vca = TANGUY.voice1.createGain();
TANGUY.osc1_sqr_vca = TANGUY.voice1.createGain();
TANGUY.osc1_tri_vca = TANGUY.voice1.createGain();
TANGUY.osc1_sin_vca = TANGUY.voice1.createGain();
TANGUY.osc1_saw_vca.gain.value = 1;
TANGUY.osc1_sqr_vca.gain.value = 0;
TANGUY.osc1_tri_vca.gain.value = 0;
TANGUY.osc1_sin_vca.gain.value = 0;
TANGUY.osc1_saw_vca.connect(TANGUY.osc1_vca);
TANGUY.osc1_sqr_vca.connect(TANGUY.osc1_vca);
TANGUY.osc1_tri_vca.connect(TANGUY.osc1_vca);
TANGUY.osc1_sin_vca.connect(TANGUY.osc1_vca);

//OSC 1 WAVEFORMS
TANGUY.osc1_saw = TANGUY.voice1.createOscillator();
TANGUY.osc1_sqr = TANGUY.voice1.createOscillator();
TANGUY.osc1_tri = TANGUY.voice1.createOscillator();
TANGUY.osc1_sin = TANGUY.voice1.createOscillator();
TANGUY.osc1_saw.type = "sawtooth";
TANGUY.osc1_sqr.type = "square";
TANGUY.osc1_tri.type = "triangle";
TANGUY.osc1_sin.type = "sine";
TANGUY.osc1_saw.frequency.value = TANGUY.osc1_pitch || 440;
TANGUY.osc1_sqr.frequency.value = TANGUY.osc1_pitch || 440;
TANGUY.osc1_tri.frequency.value = TANGUY.osc1_pitch || 440;
TANGUY.osc1_sin.frequency.value = TANGUY.osc1_pitch || 440;
TANGUY.osc1_saw.start(0);
TANGUY.osc1_sqr.start(0);
TANGUY.osc1_tri.start(0.13);
TANGUY.osc1_sin.start(0.02);
TANGUY.osc1_saw.connect(TANGUY.osc1_saw_vca);
TANGUY.osc1_sqr.connect(TANGUY.osc1_sqr_vca);
TANGUY.osc1_tri.connect(TANGUY.osc1_tri_vca);
TANGUY.osc1_sin.connect(TANGUY.osc1_sin_vca);

//FM OSCILLATOR 1
TANGUY.osc1_fm_vca = TANGUY.voice1.createGain();
TANGUY.osc1_fm_vca.gain.value = parseFloat(TANGUY.program.osc1.fm_amt * 24000);
TANGUY.osc1_fm_vca.connect(TANGUY.osc1_saw.frequency);
TANGUY.osc1_fm_vca.connect(TANGUY.osc1_sqr.frequency);
TANGUY.osc1_fm_vca.connect(TANGUY.osc1_tri.frequency);
TANGUY.osc1_fm_vca.connect(TANGUY.osc1_sin.frequency);

//OSC 2 WAVESHAPER
TANGUY.waveshaper = TANGUY.voice1.createWaveShaper();
TANGUY.waveshaper.curve = null;
TANGUY.waveshaper.connect(TANGUY.osc2_vca);

//OSC 2
TANGUY.osc2 = TANGUY.voice1.createOscillator();
TANGUY.osc2.type = TANGUY.program.osc2.waveform;
TANGUY.osc2.frequency.value = parseFloat((TANGUY.osc2_pitch + TANGUY.program.osc2.fine) * TANGUY.program.osc2.coarse);
TANGUY.osc2.start(0);
TANGUY.osc2.connect(TANGUY.osc1_fm_vca);
TANGUY.osc2.connect(TANGUY.waveshaper);

//FM OSCILLATOR 2
TANGUY.osc2_fm_vca = TANGUY.voice1.createGain();
TANGUY.osc2_fm_vca.gain.value = parseFloat(TANGUY.program.osc2.fm_amt * 24000);
TANGUY.osc2_fm_vca.connect(TANGUY.osc2.frequency);
TANGUY.osc1_sin_vca.connect(TANGUY.osc2_fm_vca);

//NOISE SECTION
TANGUY.pink_noise_filter1 = TANGUY.voice1.createBiquadFilter();
TANGUY.pink_noise_filter2 = TANGUY.voice1.createBiquadFilter();
TANGUY.pink_noise_filter1.type = "lowpass";
TANGUY.pink_noise_filter2.type = "lowpass";
TANGUY.pink_noise_filter1.frequency.value = 8000; 
TANGUY.pink_noise_filter2.frequency.value = 4000; 
TANGUY.pink_noise_filter1.Q.value = 1;
TANGUY.pink_noise_filter2.Q.value = 1;
TANGUY.pink_noise_filter1.connect(TANGUY.pink_noise_filter2);
TANGUY.pink_noise_filter2.connect(TANGUY.noise_vca);
TANGUY.empty_white_noise_buffer = TANGUY.voice1.createBuffer(1, 1, TANGUY.voice1.sampleRate);
TANGUY.empty_pink_noise_buffer = TANGUY.voice1.createBuffer(1, 1, TANGUY.voice1.sampleRate);
TANGUY.empty_red_noise_buffer = TANGUY.voice1.createBuffer(1, 1, TANGUY.voice1.sampleRate);
TANGUY.empty_blue_noise_buffer = TANGUY.voice1.createBuffer(1, 1, TANGUY.voice1.sampleRate);
TANGUY.empty_purple_noise_buffer = TANGUY.voice1.createBuffer(1, 1, TANGUY.voice1.sampleRate);
TANGUY.white_noise_buffer = TANGUY.voice1.createBuffer(1, 88200, TANGUY.voice1.sampleRate);
TANGUY.pink_noise_buffer = TANGUY.voice1.createBuffer(1, 44100, TANGUY.voice1.sampleRate);
TANGUY.red_noise_buffer = TANGUY.voice1.createBuffer(1, 44100, TANGUY.voice1.sampleRate);
TANGUY.blue_noise_buffer = TANGUY.voice1.createBuffer(1, 44100, TANGUY.voice1.sampleRate);
TANGUY.purple_noise_buffer = TANGUY.voice1.createBuffer(1, 44100, TANGUY.voice1.sampleRate);
TANGUY.white_noise = TANGUY.voice1.createBufferSource();
TANGUY.pink_noise = TANGUY.voice1.createBufferSource();
TANGUY.red_noise = TANGUY.voice1.createBufferSource();
TANGUY.blue_noise = TANGUY.voice1.createBufferSource();
TANGUY.purple_noise = TANGUY.voice1.createBufferSource();
TANGUY.white_noise.start(0);
TANGUY.pink_noise.start(0);
TANGUY.red_noise.start(0);
TANGUY.blue_noise.start(0);
TANGUY.purple_noise.start(0);
TANGUY.white_noise.loop = true;
TANGUY.pink_noise.loop = true;
TANGUY.red_noise.loop = true;
TANGUY.blue_noise.loop = true;
TANGUY.purple_noise.loop = true;
TANGUY.white_noise.buffer = TANGUY.white_noise_buffer;
TANGUY.pink_noise.buffer = TANGUY.empty_pink_noise_buffer;
TANGUY.red_noise.buffer = TANGUY.empty_red_noise_buffer;
TANGUY.blue_noise.buffer = TANGUY.empty_blue_noise_buffer;
TANGUY.purple_noise.buffer = TANGUY.empty_purple_noise_buffer;
TANGUY.white_noise.connect(TANGUY.noise_vca);
TANGUY.pink_noise.connect(TANGUY.pink_noise_filter1);
TANGUY.red_noise.connect(TANGUY.noise_vca);
TANGUY.blue_noise.connect(TANGUY.noise_vca);
TANGUY.purple_noise.connect(TANGUY.noise_vca);
var white_noise_data = TANGUY.white_noise_buffer.getChannelData(0);
    for (var i = 0; i < 88200; ++i) {
        white_noise_data[i] = (2 * Math.random() - 1);
    };
var pink_noise_data = TANGUY.pink_noise_buffer.getChannelData(0);
    for (var i = 0; i < 44100; ++i) {
        pink_noise_data[i] = Math.floor((Math.random() * (2000 - 20) + 20) / 1000);
        var pink_noise_repeat = pink_noise_data[i];
        i++;
        for (var j = 0; j < 4; ++j) {
            pink_noise_data[i] = Math.abs(pink_noise_repeat);
            i++;
            pink_noise_data[i] = Math.abs(pink_noise_repeat) * 0.5;
        };
    };
//OTHER TYPES OF NOISE GUESS WORK HERE
var red_noise_data = TANGUY.red_noise_buffer.getChannelData(0);
    for (var i = 0; i < 44100; ++i) {
        red_noise_data[i] = (-1 * Math.random() + 2);
        var red_noise_repeat = red_noise_data[i];
        i++;
        for (var j = 0; j < 237; ++j) {
            red_noise_data[i] = (red_noise_repeat * 0.5);
            i++;
        };
    };
var blue_noise_data = TANGUY.blue_noise_buffer.getChannelData(0);
    for (var i = 0; i < 44100; ++i) {
        blue_noise_data[i] = (-1 * Math.random() + 1);
        var blue_noise_repeat = blue_noise_data[i];
        i++;
        for (var j = 0; j < 137; ++j) {
            blue_noise_data[i] = (blue_noise_repeat * 0.5);
            i++;
        };
    };
var purple_noise_data = TANGUY.purple_noise_buffer.getChannelData(0);
    for (var i = 0; i < 44100; ++i) {
        purple_noise_data[i] = (-1 * Math.random() + 1);
        var purple_noise_repeat = purple_noise_data[i];
        i++;
        for (var j = 0; j < 172; ++j) {
            purple_noise_data[i] = (purple_noise_repeat * 0.75);
            i++;
        };
    };

//LFO VCAS
TANGUY.lfo_pitch_vca = TANGUY.voice1.createGain();
TANGUY.lfo_filter_vca = TANGUY.voice1.createGain();
TANGUY.lfo_amp_vca = TANGUY.voice1.createGain();
TANGUY.lfo_pitch_vca.gain.value = parseFloat(TANGUY.program.lfo.pitch_amt * TANGUY.program.mod.amt);
TANGUY.lfo_filter_vca.gain.value = parseFloat(TANGUY.program.lfo.filter_amt * TANGUY.program.mod.amt);
TANGUY.lfo_amp_vca.gain.value = parseFloat(TANGUY.program.lfo.amp_amt * TANGUY.program.mod.amt);
TANGUY.lfo_pitch_vca.connect(TANGUY.osc1_saw.frequency);
TANGUY.lfo_pitch_vca.connect(TANGUY.osc1_sqr.frequency);
TANGUY.lfo_pitch_vca.connect(TANGUY.osc1_tri.frequency);
TANGUY.lfo_pitch_vca.connect(TANGUY.osc1_sin.frequency);
TANGUY.lfo_pitch_vca.connect(TANGUY.osc2.frequency);
TANGUY.lfo_filter_vca.connect(TANGUY.lp_filter1.frequency);
TANGUY.lfo_amp_vca.connect(TANGUY.mixer.gain);

//LFO
TANGUY.lfo = TANGUY.voice1.createOscillator();
TANGUY.lfo.type = TANGUY.program.lfo.shape;
TANGUY.lfo.frequency.value = parseFloat(TANGUY.program.lfo.rate);
TANGUY.lfo.start(0);
TANGUY.lfo.connect(TANGUY.lfo_pitch_vca);
TANGUY.lfo.connect(TANGUY.lfo_filter_vca);
TANGUY.lfo.connect(TANGUY.lfo_amp_vca);

//OSCILLATOR 1 CONTROLS
$('#osc1-kbd').change(function () {
    TANGUY.program.osc1.kbd = this.checked ? true : false;
});
$('#osc1-coarse input').change(function () {
    TANGUY.program.osc1.coarse = parseFloat(this.value);
    TANGUY.osc1_saw.frequency.setValueAtTime(440 * this.value, TANGUY.voice1.currentTime),
    TANGUY.osc1_sqr.frequency.setValueAtTime(440 * this.value, TANGUY.voice1.currentTime),
    TANGUY.osc1_tri.frequency.setValueAtTime(440 * this.value, TANGUY.voice1.currentTime),
    TANGUY.osc1_sin.frequency.setValueAtTime(440 * this.value, TANGUY.voice1.currentTime);
});
$('#osc1-saw').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc1.saw_amt = parseFloat(this.value);
        TANGUY.osc1_saw_vca.gain.setValueAtTime(this.value, TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc1-sqr').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc1.sqr_amt = parseFloat(this.value);
        TANGUY.osc1_sqr_vca.gain.setValueAtTime(-1 * (this.value), TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc1-tri').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc1.tri_amt = parseFloat(this.value);
        TANGUY.osc1_tri_vca.gain.setValueAtTime(this.value, TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc1-sin').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc1.sin_amt = parseFloat(this.value);
        TANGUY.osc1_sin_vca.gain.setValueAtTime(this.value, TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc1-fm').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc1.fm_amt = parseFloat(this.value);
        TANGUY.osc1_fm_vca.gain.setValueAtTime(((this.value * this.value) * 22050), TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});

//OSCILLATOR 2 CONTROLS
$('#osc2-kbd').change(function () {
    TANGUY.program.osc2.kbd = this.checked ? true : false;
});
$('#osc2-coarse input').change(function () {
    TANGUY.program.osc2.coarse = parseFloat(this.value);
    TANGUY.osc2.frequency.setValueAtTime(440 * this.value, TANGUY.voice1.currentTime);
});
$('#osc2-detune').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc2.detune = parseFloat(this.value);
        TANGUY.osc2.detune.setValueAtTime(parseFloat(TANGUY.osc2_pitch + (TANGUY.program.osc2.detune)), TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc2-fine').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc2.fine = parseFloat(this.value);        
        TANGUY.osc2.frequency.setValueAtTime(((440 * TANGUY.program.osc2.coarse) + TANGUY.program.osc2.fine), TANGUY.voice1.currentTime);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc2-saw, #osc2-sqr, #osc2-tri, #osc2-pls').change(function () {
    TANGUY.program.osc2.waveform = this.value;
    TANGUY.osc2.type = this.value;
});
$('#osc2-waveshape').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc2.shape_amt = parseFloat(this.value);
        if (parseFloat(this.value) > 0) {
            TANGUY.waveshaper.curve = new Float32Array([parseFloat(this.value * 1.6), parseFloat(this.value * -2.5), parseFloat(this.value * -1.2), parseFloat(this.value * -2.4), parseFloat(this.value * -1.6), parseFloat(this.value * -3.2), parseFloat(this.value * 6.4), parseFloat(this.value * -3.2)]);
            console.log('Waveshaping applied');
        } else {
            TANGUY.waveshaper.curve = null;
            console.log('Waveshaper reset to null');
        }
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#osc2-fm').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.osc2.fm_amt = parseFloat(this.value);
        TANGUY.osc2_fm_vca.gain.setValueAtTime(((this.value * this.value) * 22050), TANGUY.voice1.currentTime);//220.5
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});


//NOISE CONTROLS
$('#white-noise, #pink-noise, #red-noise, #blue-noise, #purple-noise').change(function () {
    TANGUY.program.noise.color = this.value;
    switch (this.value) {
        case "white":
            TANGUY.white_noise.buffer = TANGUY.white_noise_buffer;
            TANGUY.pink_noise.buffer = TANGUY.empty_pink_noise_buffer;
            TANGUY.red_noise.buffer = TANGUY.empty_red_noise_buffer;
            TANGUY.blue_noise.buffer = TANGUY.empty_blue_noise_buffer;
            TANGUY.purple_noise.buffer = TANGUY.empty_purple_noise_buffer;
            break;
        case "pink":
            TANGUY.pink_noise.buffer = TANGUY.pink_noise_buffer;
            TANGUY.white_noise.buffer = TANGUY.empty_white_noise_buffer;
            TANGUY.red_noise.buffer = TANGUY.empty_red_noise_buffer;
            TANGUY.blue_noise.buffer = TANGUY.empty_blue_noise_buffer;
            TANGUY.purple_noise.buffer = TANGUY.empty_purple_noise_buffer;
            break;
        case "red":
            TANGUY.red_noise.buffer = TANGUY.red_noise_buffer;
            TANGUY.white_noise.buffer = TANGUY.empty_white_noise_buffer;
            TANGUY.pink_noise.buffer = TANGUY.empty_pink_noise_buffer;
            TANGUY.blue_noise.buffer = TANGUY.empty_blue_noise_buffer;
            TANGUY.purple_noise.buffer = TANGUY.empty_purple_noise_buffer;
            break;
        case "blue":
            TANGUY.blue_noise.buffer = TANGUY.blue_noise_buffer;
            TANGUY.white_noise.buffer = TANGUY.empty_white_noise_buffer;
            TANGUY.pink_noise.buffer = TANGUY.empty_pink_noise_buffer;
            TANGUY.red_noise.buffer = TANGUY.empty_red_noise_buffer;
            TANGUY.purple_noise.buffer = TANGUY.empty_purple_noise_buffer;
            break;
        case "purple":
            TANGUY.purple_noise.buffer = TANGUY.purple_noise_buffer;
            TANGUY.white_noise.buffer = TANGUY.empty_white_noise_buffer;
            TANGUY.pink_noise.buffer = TANGUY.empty_pink_noise_buffer;
            TANGUY.red_noise.buffer = TANGUY.empty_red_noise_buffer;
            TANGUY.blue_noise.buffer = TANGUY.empty_blue_noise_buffer;
            break;
    };
});


//LFO CONTROLS
$('#lfo-sin, #lfo-tri, #lfo-rmp, #lfo-saw, #lfo-sqr').change(function () {
    switch (this.value) {
        case "sine":
            TANGUY.program.lfo.shape = this.value;
            TANGUY.lfo.type = this.value;
            break;
        case "triangle":
            TANGUY.program.lfo.shape = this.value;
            TANGUY.lfo.type = this.value;
            break;
        case "ramp": 
            TANGUY.program.lfo.shape = "sawtooth";
            TANGUY.program.mod.direction = 1;
            TANGUY.lfo_pitch_vca.gain.value = parseFloat(TANGUY.program.lfo.pitch_amt * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
            TANGUY.lfo_filter_vca.gain.value = parseFloat(TANGUY.program.lfo.filter_amt * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
            TANGUY.lfo_amp_vca.gain.value = parseFloat(TANGUY.program.lfo.amp_amt * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
            TANGUY.lfo.type = this.value;
            console.log('just making sure ramp got hit');
            break;
        case "sawtooth":
            TANGUY.program.lfo.shape = "sawtooth";
            TANGUY.program.mod.direction = -1;
            TANGUY.lfo_pitch_vca.gain.value = parseFloat(TANGUY.program.lfo.pitch_amt * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
            TANGUY.lfo_filter_vca.gain.value = parseFloat(TANGUY.program.lfo.filter_amt * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
            TANGUY.lfo_amp_vca.gain.value = parseFloat(TANGUY.program.lfo.amp_amt * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
            TANGUY.lfo.type = this.value;
            break;
        case "square":
            TANGUY.program.lfo.shape = this.value;
            TANGUY.lfo.type = this.value;
            break;
    };
});
$('#lfo-rate').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.lfo.rate = parseFloat(this.value);
        TANGUY.lfo.frequency.value = parseFloat(this.value);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#lfo-pitch').change(function () {
    TANGUY.program.lfo.pitch_amt = parseFloat(this.value);
    TANGUY.lfo_pitch_vca.gain.value = parseFloat(this.value * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
});
$('#lfo-filter').change(function () {
    TANGUY.program.lfo.filter_amt = parseFloat(this.value);
    TANGUY.lfo_filter_vca.gain.value = parseFloat(this.value * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
});
$('#lfo-amp').change(function () {
    TANGUY.program.lfo.amp_amt = parseFloat(this.value);
    TANGUY.lfo_amp_vca.gain.value = parseFloat(this.value * TANGUY.program.mod.amt * TANGUY.program.mod.direction);
});

//MIXER CONTROLS
$('#osc1-mix').change(function () {
    TANGUY.osc1_vca.gain.value = parseFloat(this.value);
    TANGUY.program.mixer.osc1 = parseFloat(this.value);
});
$('#osc2-mix').change(function () {
    TANGUY.osc2_vca.gain.value = parseFloat(this.value);
    TANGUY.program.mixer.osc2 = parseFloat(this.value);
});
$('#noise-mix').change(function () {
    TANGUY.noise_vca.gain.value = parseFloat(this.value);
    TANGUY.program.mixer.noise = parseFloat(this.value);
});
$('#external-mix').change(function () {
    TANGUY.ext_in_vca.gain.value = parseFloat(this.value);
    TANGUY.program.mixer.external = parseFloat(this.value);
});


//FILTER CONTROLS
$('#filter-lp, #filter-bp, #filter-hp, #filter-notch, #filter-off').change(function () {
    TANGUY.program.filter.mode = this.value;
    switch (this.value) {
        case "lp":
            TANGUY.mixer.disconnect();
            TANGUY.mixer.connect(TANGUY.lp_filter1);
            TANGUY.lfo_filter_vca.disconnect();
            TANGUY.lfo_filter_vca.connect(TANGUY.lp_filter1.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.lp_filter2.frequency);
            break;
        case "bp":
            TANGUY.mixer.disconnect();
            TANGUY.mixer.connect(TANGUY.bp_filter1);
            TANGUY.lfo_filter_vca.disconnect();
            TANGUY.lfo_filter_vca.connect(TANGUY.bp_filter1.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.bp_filter2.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.bp_filter3.frequency);
            break;
        case "hp":
            TANGUY.mixer.disconnect();
            TANGUY.mixer.connect(TANGUY.hp_filter1);
            TANGUY.lfo_filter_vca.disconnect();
            TANGUY.lfo_filter_vca.connect(TANGUY.hp_filter1.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.hp_filter2.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.hp_filter3.frequency);
            break;
        case "notch":
            TANGUY.mixer.disconnect();
            TANGUY.mixer.connect(TANGUY.notch1);
            TANGUY.lfo_filter_vca.disconnect();
            TANGUY.lfo_filter_vca.connect(TANGUY.notch1.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.notch2.frequency);
            TANGUY.lfo_filter_vca.connect(TANGUY.notch3.frequency);
            break;
        case "off":
            TANGUY.mixer.disconnect();        
            TANGUY.mixer.connect(TANGUY.vca);
            TANGUY.lfo_filter_vca.disconnect();
            break;
    };
});
$('#cutoff').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.filter.frequency = parseFloat(this.value);
        TANGUY.lp_filter1.frequency.setTargetAtTime((parseFloat(this.value / 22014) * parseFloat(this.value)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.lp_filter2.frequency.setTargetAtTime(((parseFloat(this.value / 22014) * parseFloat(this.value)) / 2), TANGUY.voice1.currentTime, 0.08);
        TANGUY.bp_filter1.frequency.setTargetAtTime(((parseFloat(this.value) / 22014) * parseFloat(this.value)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.bp_filter2.frequency.setTargetAtTime((parseFloat(this.value) - (parseFloat(this.value) / 11)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.bp_filter3.frequency.setTargetAtTime((parseFloat(this.value) + (parseFloat(this.value) / 11)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.hp_filter1.frequency.setTargetAtTime((parseFloat(this.value / 22014) * parseFloat(this.value)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.hp_filter2.frequency.setTargetAtTime((parseFloat(this.value / 22014) * parseFloat(this.value)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.hp_filter3.frequency.setTargetAtTime((parseFloat(this.value / 22014) * parseFloat(this.value)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.notch1.frequency.setTargetAtTime((parseFloat(this.value / 22014) * parseFloat(this.value)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.notch2.frequency.setTargetAtTime((parseFloat(this.value) - (parseFloat(this.value) / 9)), TANGUY.voice1.currentTime, 0.08);
        TANGUY.notch3.frequency.setTargetAtTime((parseFloat(this.value) + (parseFloat(this.value) / 9)), TANGUY.voice1.currentTime, 0.08);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#resonance').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.filter.resonance = parseFloat(this.value);
        TANGUY.lp_filter1.Q.setTargetAtTime(parseFloat((TANGUY.program.filter.resonance / 17) * 0.4348), TANGUY.voice1.currentTime, 0.01);
        TANGUY.lp_filter2.Q.setTargetAtTime(parseFloat((TANGUY.program.filter.resonance / 35) * 0.8692), TANGUY.voice1.currentTime, 0.01);
        TANGUY.bp_filter2.gain.setTargetAtTime(parseFloat(TANGUY.program.filter.resonance / 166), TANGUY.voice1.currentTime, 0.08);
        TANGUY.bp_filter3.gain.setTargetAtTime(parseFloat(TANGUY.program.filter.resonance / 166), TANGUY.voice1.currentTime, 0.08);
        TANGUY.hp_filter1.Q.setTargetAtTime(10, TANGUY.voice1.currentTime, 0.01);
        TANGUY.hp_filter2.Q.setTargetAtTime(10, TANGUY.voice1.currentTime, 0.01);
        TANGUY.notch2.gain.setTargetAtTime(parseFloat(TANGUY.program.filter.resonance / -166), TANGUY.voice1.currentTime, 0.08);
        TANGUY.notch3.gain.setTargetAtTime(parseFloat(TANGUY.program.filter.resonance / -166), TANGUY.voice1.currentTime, 0.08);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});
$('#filter-envelope-amount').change(function () {
    TANGUY.program.filter.env_amt = parseFloat(this.value);
});
$('#filter-keyboard-tracking').change(function () {
    TANGUY.program.filter.kbd = parseFloat(this.value);
});
$('#filter-attack').change(function () {
    TANGUY.program.filter.attack = parseFloat(this.value);
});
$('#filter-decay').change(function () {
    TANGUY.program.filter.decay = parseFloat(this.value);
});
$('#filter-sustain').change(function () {
    TANGUY.program.filter.sustain = parseFloat(this.value);
});
$('#filter-release').change(function () {
    TANGUY.program.filter.release = parseFloat(this.value);
});

//VCA CONTROLS
$('#vca-attack').change(function () {
    TANGUY.program.vca.attack = parseFloat(this.value);
});
$('#vca-decay').change(function () {
    TANGUY.program.vca.decay = parseFloat(this.value);
});
$('#vca-sustain').change(function () {
    TANGUY.program.vca.sustain = parseFloat(this.value);
});
$('#vca-release').change(function () {
    TANGUY.program.vca.release = parseFloat(this.value);
});
$('#vca-gain').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.vca.gain = parseFloat(this.value);
        TANGUY.vca.gain.value = parseFloat(this.value) * parseFloat(this.value);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});

//OCTAVE SHIFT BUTTONS
$('.octave-shift-down').click(function () {
    TANGUY.shift_octave(-1);
});
$('.octave-shift-up').click(function () {
    TANGUY.shift_octave(1);
});
$(document).keypress(function (key) {
    if (key.which === 45) {
        TANGUY.shift_octave(-1);
    } else if (key.which === 61) {
        TANGUY.shift_octave(1);
    }
    console.log(key.which + ' PRESSED');
});

//PORTAMENTO CONTROLS
$('#portamento-amount').change(function () {
    TANGUY.program.portamento.amt = this.value;
});
$('#portamento-off, #portamento-linear, #portamento-exponential').change(function () {
    TANGUY.program.portamento.mode = this.value;
    console.log('PORTAMENTO MODE IS ' + this.value);
});
$(document).keypress(function (key) {
    if (key.which === 49) {
        TANGUY.program.portamento.mode = "off";
    } else if (key.which === 50) {
        TANGUY.program.portamento.mode = "linear";
    } else if (key.which == 51) {
        TANGUY.program.portamento.mode = "exponential";
    }
});

//PITCH WHEEL
$('#pitch-bend').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.osc1_saw.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc1_sqr.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc1_tri.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc1_sin.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc2.detune.setTargetAtTime(parseFloat(TANGUY.osc2_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2);
    }).mouseup(function () {
        $(this).val(0).unbind('mousemove');
        TANGUY.osc1_saw.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc1_sqr.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc1_tri.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc1_sin.detune.setTargetAtTime(parseFloat(TANGUY.osc1_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2),
        TANGUY.osc2.detune.setTargetAtTime(parseFloat(TANGUY.osc2_pitch + ((this.value) * 100)), TANGUY.voice1.currentTime, 0.2);
    });
});

//MOD WHEEL
$('#mod-amount').mousedown(function () {//PROTECTED
    $(this).mousemove(function () {
        TANGUY.program.mod.amt = parseFloat(this.value);
        TANGUY.lfo_pitch_vca.gain.value = parseFloat(TANGUY.program.lfo.pitch_amt * this.value);
        TANGUY.lfo_filter_vca.gain.value = parseFloat(TANGUY.program.lfo.filter_amt * this.value);
        TANGUY.lfo_amp_vca.gain.value = parseFloat(TANGUY.program.lfo.amp_amt * this.value);
    });
}).mouseup(function () {
    $(this).unbind('mousemove');
});

//MULTI-SWITCHES
$('.horizontal-multi-switch label input, .vertical-multi-switch label input').click(function() {
    TANGUY.multi_switch(this);  
});

//TARGET KEYBOARD CLICKS
$('#keyboard button').mousedown(TANGUY.gate_on).mouseup(TANGUY.gate_off);

$(document).keydown(function (key) {
    switch (key.which) {
        case 65:
            $('#c1').trigger('mousedown');
            break;
        case 83:
            $('#d1').trigger('mousedown');
            break;
        case 68:
            $('#e1').trigger('mousedown');
            break;
        case 70:
            $('#f1').trigger('mousedown');
            break;
        case 71:
            $('#g1').trigger('mousedown');
            break;
        case 72:
            $('#a1').trigger('mousedown');
            break;
        case 74:
            $('#b1').trigger('mousedown');
            break;
        case 75:
            $('#c2').trigger('mousedown');
            break;
        case 76:
            $('#d2').trigger('mousedown');
            break;
        case 186:
            $('#e2').trigger('mousedown');
            break;
        case 222:
            $('#f2').trigger('mousedown');
            break;
        case 87:
            $('#cs1').trigger('mousedown');
            break;
        case 69:
            $('#ds1').trigger('mousedown');
            break;
        case 84:
            $('#fs1').trigger('mousedown');
            break;
        case 89:
            $('#gs1').trigger('mousedown');
            break;
        case 85:
            $('#as1').trigger('mousedown');
            break;
        case 79:
            $('#cs2').trigger('mousedown');
            break;
        case 80:
            $('#ds2').trigger('mousedown');
            break;
        case 219:
            $('#fs2').trigger('mousedown');
            break;
        case 221:
            $('#gs2').trigger('mousedown');
            break;
    };
}).keyup(function (key) {
    switch (key.which) {
        case 65:
            $('#c1').trigger('mouseup');
            break;
        case 83:
            $('#d1').trigger('mouseup');
            break;
        case 68:
            $('#e1').trigger('mouseup');
            break;
        case 70:
            $('#f1').trigger('mouseup');
            break;
        case 71:
            $('#g1').trigger('mouseup');
            break;
        case 72:
            $('#a1').trigger('mouseup');
            break;
        case 74:
            $('#b1').trigger('mouseup');
            break;
        case 75:
            $('#c2').trigger('mouseup');
            break;
        case 76:
            $('#d2').trigger('mouseup');
            break;
        case 186:
            $('#e2').trigger('mouseup');
            break;
        case 222:
            $('#f2').trigger('mouseup');
            break;
        case 87:
            $('#cs1').trigger('mouseup');
            break;
        case 69:
            $('#ds1').trigger('mouseup');
            break;
        case 84:
            $('#fs1').trigger('mouseup');
            break;
        case 89:
            $('#gs1').trigger('mouseup');
            break;
        case 85:
            $('#as1').trigger('mouseup');
            break;
        case 79:
            $('#cs2').trigger('mouseup');
            break;
        case 80:
            $('#ds2').trigger('mouseup');
            break;
        case 219:
            $('#fs2').trigger('mouseup');
            break;
        case 221:
            $('#gs2').trigger('mouseup');
            break;
    };
});